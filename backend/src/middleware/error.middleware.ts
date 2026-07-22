import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";


export const notFound = (request: Request, response: Response) => {
  response.status(404).json({ success: false, message: "Route not found" });
};

export const errorHandler = (
  err: Error | ApiError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ApiError) {
    return response.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  return response.status(500).json({
    success: false,
    message: "Internal server error",
  });
};