import passport from "passport";
import httpStatus from "http-status";
import { ApiError } from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";

const verifyCallback =
  (
    req: Request,
    resolve: (value?: unknown) => void,
    reject: (reason?: any) => void
  ) =>
  async (
    err: any,
    user: Express.User | false | null,
    info: object | string | Array<string | undefined>
  ) => {
    if (err || info || !user) {
      if (info?.toString().includes("TokenExpiredError"))
        return reject(new ApiError(httpStatus.UNAUTHORIZED, "expired"));
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    req.user = user;

    resolve();
  };

export const auth =
  () => async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };
