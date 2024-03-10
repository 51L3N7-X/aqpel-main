import { Request, Response } from "express";
import { getS3Url } from "../../services/getS3Url";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";

export const getUrl = catchAsync(async (req: Request, res: Response) => {
  const fileExtension = req.query.fileExtension as string;
  if (!fileExtension) throw new ApiError(400, "Please insert file extension");
  const allowExtensions = ["png", "jpg", "jepg"];
  if (!allowExtensions.includes(fileExtension))
    throw new Error("Only images are allowed");
  const url = await getS3Url(fileExtension);
  res.json({ url });
});
