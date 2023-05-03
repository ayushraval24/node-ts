import { Request, Response, NextFunction } from "express";
import { Error } from "../interfaces/index";

// not found
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// error handling
export const errorHandler = (err: Error, req: Request, res: Response) => {
  console.log("INSIDE: ", err);
  if (err) {
    let status = err.status || 500;
    let message = err.message || "Something went wrong";
    return res.status(status).json({
      success: false,
      message: message,
    });
  }
};
