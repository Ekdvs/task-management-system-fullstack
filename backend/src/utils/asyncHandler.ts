import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler =
  (fn: (request: Request, response: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (request, response, next) => {
    fn(request, response, next).catch(next);
  };

export default asyncHandler;