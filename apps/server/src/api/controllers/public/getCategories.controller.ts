import { RequestWithUser } from "../../../types/controllers";
import { Category } from "../../models/category";
import { catchAsync } from "../../utils/catchAsync";
import { Response } from "express";

export const getCategories = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const categories = await Category.find({
      restaurantId: req.params.restaurantId,
    });
    return res.status(200).json(categories || []);
  }
);
