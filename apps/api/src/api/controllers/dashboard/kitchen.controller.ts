import { Restaurant } from "../../models/restaurant";
import { Kitchen } from "../../models/kitchen";
import { RequestWithUser } from "../../../types/controllers";
import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";

export const addKitchen = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.findOne({ userId: req.user.id });
    if (!restaurant) throw new ApiError(404, "Restaurnat not found.");
    const kitchen = await new Kitchen({
      userId: req.user.id,
      restaurant_name: restaurant.name,
      ...req.body,
    });
    await kitchen.save();
    return res.status(200).json(kitchen);
  }
);

export const getTheKitchen = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const kitchen = await Kitchen.findOne({
      userId: req.user.id,
    });
    return res.status(200).json(kitchen || {});
  }
);

export const modifyKitchen = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const kitchen = await Kitchen.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!kitchen) throw new ApiError(404, "Kitchen not found.");
    return res.status(200).json({ success: true, ...kitchen.toObject() });
  }
);

export const deleteKitchen = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await Kitchen.deleteOne({
      userId: req.user.id,
    });
    return res.send({ success: true });
  }
);
