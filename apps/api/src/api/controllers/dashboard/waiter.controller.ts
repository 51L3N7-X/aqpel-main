import { Waiter } from "../../models/waiter";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { RequestWithUser } from "../../../types/controllers";
import { Response } from "express";
import { ApiError } from "../../utils/ApiError";

export const addWaiter = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.findOne({ userId: req.user.id });
    if (!restaurant) throw new ApiError(404, "restaurnat not found.");
    const waiter = await new Waiter({
      userId: req.user.id,
      restaurant_name: restaurant.name,
      ...req.body,
    });
    await waiter.save();
    return res.status(200).json(waiter);
  }
);

export const getWaiters = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const waiters = await Waiter.find({
      userId: req.user.id,
    });
    return res.status(200).json(waiters || {});
  }
);

export const getIndivWaiter = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const waiter = await Waiter.findOne({
      userId: req.user.id,
      _id: req.params.waiterId,
    });
    return res.status(200).json(waiter);
  }
);

export const modifyWaiter = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const waiter = await Waiter.findOneAndUpdate(
      { _id: req.params.waiterId, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!waiter) throw new ApiError(404, "Waiter not found.");
    return res.status(200).json({ success: true, ...waiter.toObject() });
  }
);

export const deleteWaiter = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await Waiter.deleteOne({
      _id: req.params.waiterId,
      userId: req.user.id,
    });
    return res.send({ success: true });
  }
);
