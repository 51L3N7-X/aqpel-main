import express from "express";
import cors from "cors";
import multer from "multer";
import { successHandler } from "./morgan";
import { errorHandler as morganErrorHandler } from "./morgan";
import { config } from "./config";
import { router as routes } from "../routes/v1/index";
import passport from "passport";
import { jwtStrategy } from "./passport_config";
import parser from "body-parser";
import { errorConverter, errorHandler } from "../middlewares/error";
import httpStatus from "http-status";
import { ApiError } from "../utils/ApiError";

export const app = express();

if (config.env !== "test") {
  app.use(successHandler);
  app.use(morganErrorHandler);
}

app.use(cors({ origin: "*" }));

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(multer().none());

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/v1", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);

app.use(errorHandler);
