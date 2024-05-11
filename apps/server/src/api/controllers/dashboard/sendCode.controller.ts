import { Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { catchAsync } from "../../utils/catchAsync";

const smscode = require("../../models/smsCode");

export const sendCode = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const { phone } = req.body;

    const code = Math.floor(1000 + Math.random() * 9000);

    let user = await smscode.findOne({ phone });

    if (user) {
      await user.set({ phone, code }).save();
    } else {
      await smscode.create({ phone, code });
    }

    // TODO: send code here

    return res.status(200).json({ success: "true", code });
  }
);
