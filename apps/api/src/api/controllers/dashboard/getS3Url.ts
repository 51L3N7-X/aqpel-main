import { Request, Response } from "express";
import { getS3Url } from "../../services/getS3Url";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import httpStatus from "http-status";
import { RequestWithUser } from "../../../types/controllers";

export const getUrl = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const fileExtension = req.query.fileExtension as string;
    // if (!fileExtension) throw new ApiError(400, "Please insert file extension");
    const allowExtensions = ["png", "jpg", "jepg"];
    if (!fileExtension || !allowExtensions.includes(fileExtension))
      throw new ApiError(httpStatus.BAD_REQUEST, "Only images are allowed");
    const s3Data = await getS3Url(fileExtension, req.user.id);
    res.send(s3Data);
  }
);
