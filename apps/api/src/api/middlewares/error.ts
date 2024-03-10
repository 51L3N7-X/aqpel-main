import mongoose from "mongoose";
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const errorConverter = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err as any;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    const errors = error.errors || [];
    error = new ApiError(statusCode, message, errors, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, message, errors } = err;
  //   if (config.env === "production" && !err.isOperational) {
  //     statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  //     message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  //   }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    code: statusCode,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).send(response);
};
