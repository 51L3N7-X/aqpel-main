import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus, { HttpStatus } from "http-status";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token)
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ success: false, message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY!);
    //@ts-ignore
    req.user = decoded;
    return next();
  } catch (err) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ success: false, message: "Unauthorized" });
  }
};
