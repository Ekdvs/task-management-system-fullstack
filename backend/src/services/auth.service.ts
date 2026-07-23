import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  refreshExpiryDate,
} from "../utils/jwt.js";

interface LoginResult {
  token: string;
  refreshToken: string;
  user: { id: number; name: string; email: string };
}

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  const payload = { id: user.id, email: user.email };
  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiryDate() },
  });

  return {
    token,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new ApiError(401, "Refresh token missing");

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw new ApiError(401, "Refresh token no longer valid");
  }

  // Rotate: revoke the old one, issue a new pair
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });

  const payload = { id: decoded.id, email: decoded.email };
  const newAccessToken = generateToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: { token: newRefreshToken, userId: decoded.id, expiresAt: refreshExpiryDate() },
  });

  return { token: newAccessToken, refreshToken: newRefreshToken };
};

export const revokeRefreshToken = async (refreshToken: string) => {
  if (!refreshToken) return;
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { revoked: true },
  });
};