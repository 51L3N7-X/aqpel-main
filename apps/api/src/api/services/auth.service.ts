import httpStatus from "http-status";
import { tokenTypes } from "../constants/tokens";
import { Token } from "../models/token";
import { ApiError } from "../utils/ApiError";
import { tokenService } from ".";
import { User } from "../models/user";

export const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });

  if (!refreshTokenDoc) throw new ApiError(httpStatus.NOT_FOUND, "Not Found");

  await refreshTokenDoc?.deleteOne();
};

export const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );

    if (!refreshTokenDoc)
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

    const user = await User.findById(refreshTokenDoc.userId);
    if (!user)
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "User not found with that token, Please login"
      );
    await refreshTokenDoc.deleteOne();
    return await tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};
