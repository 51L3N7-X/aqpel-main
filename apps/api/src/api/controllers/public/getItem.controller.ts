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
    return res.status(200).send(item);
  }
);

export const getItems = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const items = await Item.find({ restaurant_id: req.params.restaurantId });
    return res.status(200).json(items || {});
  }
);
