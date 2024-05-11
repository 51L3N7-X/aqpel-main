import { User } from "../../models/user";
import bcrypt from "bcrypt";
import { catchAsync } from "../../utils/catchAsync";
import { RequestWithUser } from "../../../types/controllers";
import { Response } from "express";
import { ApiError } from "../../utils/ApiError";

export const getUser = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const user = await User.findById(req.user.id).lean();
    if (user) {
      Object.defineProperty(user, "password", {
        enumerable: false,
      });
    }
    res.send(user || {});
  }
);

export const modifyUser = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!user) throw new ApiError(404, "user not found.");
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }
    await user.save();
    return res.send({ success: true, ...user.toObject() });
  }
);

export const deleteUser = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await User.findByIdAndDelete(req.user.id);
    res.send({ success: true });
  }
);
