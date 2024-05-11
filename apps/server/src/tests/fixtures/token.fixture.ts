import { config } from "../../api/config/config";
import moment from "moment";
import { tokenService } from "../../api/services";
import { tempUser, tempUser2 } from "./auth.fixture";
import { tokenTypes } from "../../api/constants/tokens";
import mongoose, { ObjectId } from "mongoose";

const accessTokenExpires = moment().add(
  config.jwt.accessExpirationMinutes,
  "minutes"
);

export const tempUserAccessToken = tokenService.generateToken(
  tempUser._id,
  accessTokenExpires,
  tokenTypes.ACCESS
);

export const tempUser2AccessToken = tokenService.generateToken(
  tempUser2._id,
  accessTokenExpires,
  tokenTypes.ACCESS
);
