import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";


export const authenticate = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication token missing"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    request.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};