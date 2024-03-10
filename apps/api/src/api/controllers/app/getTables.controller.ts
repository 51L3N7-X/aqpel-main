import { Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { Kitchen } from "../../models/kitchen";
import { Table } from "../../models/table";
import { catchAsync } from "../../utils/catchAsync";

export const getTables = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const kitchen = await Kitchen.findOne({ _id: req.user.id });

    if (!kitchen) throw new Error("kitchen not found.");

    const tables = await Table.findOne({
      restaurant_name: kitchen.restaurant_name,
    }).select("-userId");

    return res.status(200).json(tables || []);
  }
);
