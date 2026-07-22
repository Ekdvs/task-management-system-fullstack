import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";


export const validate = (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation failed", errors.array()));
  }
  next();
};