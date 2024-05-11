import { Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { Item } from "../../models/item";
import { ApiError } from "../../utils/ApiError";
import { catchAsync } from "../../utils/catchAsync";

export const getItem = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const item = await Item.findOne({ _id: req.params.itemId });
    if (!item || Object.keys(item).length <= 0)
      throw new ApiError(404, "Item not found");
    return res.send(item);
  }
);

export const getItems = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    console.log(req.params);
    const items = await Item.find({ restaurantId: req.params.restaurantId });
    if (!items || !Object.keys(items).length)
      throw new ApiError(404, "Items not found");
    return res.send(items);
  }
);
