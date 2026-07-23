import { loginUser, refreshAccessToken, revokeRefreshToken } from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Request, Response } from "express";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth", // only sent to auth routes
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = asyncHandler(async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const result = await loginUser(email, password);

  response.cookie("refresh_token", result.refreshToken, REFRESH_COOKIE_OPTIONS);

  response.status(200).json({
    success: true,
    message: "Login Successful",
    data: { token: result.token, user: result.user },
  });
});

export const refresh = asyncHandler(async (request: Request, response: Response) => {
  const refreshToken = request.cookies?.refresh_token;
  const result = await refreshAccessToken(refreshToken);

  response.cookie("refresh_token", result.refreshToken, REFRESH_COOKIE_OPTIONS);

  response.status(200).json({
    success: true,
    data: { token: result.token },
  });
});

export const logout = asyncHandler(async (request: Request, response: Response) => {
  const refreshToken = request.cookies?.refresh_token;
  await revokeRefreshToken(refreshToken);
  response.clearCookie("refresh_token", { path: "/api/auth" });

  response.status(200).json({ success: true, message: "Logout successful" });
});