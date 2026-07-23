import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/index.js";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m"; // shorten the access token

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(
    {
      ...payload,
      tokenId: crypto.randomUUID(),
    },
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_EXPIRES_IN,
    } as jwt.SignOptions
  );
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};

export const refreshExpiryDate = (): Date => {
  const days = 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};