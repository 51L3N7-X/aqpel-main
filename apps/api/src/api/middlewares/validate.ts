import Joi, { Schema } from "joi";
import { ApiError } from "../utils/ApiError";
import { pick } from "../utils/pick";
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(object);

    if (error) {
      // const errorMessage = error.details
      //   .map((details) => details.message)
      //   .join(", ");

      const errors = error.details.map((detail) => ({
        message: detail.message,
        type: detail.context?.key,
      }));

      return next(
        new ApiError(httpStatus.BAD_REQUEST, "Invalid inputs", errors)
      );
    }
    Object.assign(req, value);
    return next();
  };
