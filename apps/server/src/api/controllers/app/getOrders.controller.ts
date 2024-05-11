import { Order } from "../../models/order";
import { Waiter } from "../../models/waiter";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

export const getOrders = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const waiter = await Waiter.findOne({ _id: req.user.id });
    if (!waiter) throw new ApiError(404, "waiter not found");
    const orders = await Order.find({
      table_id: { $in: waiter.tables },
      done: false,
    }).sort({ createdAt: 1 });
    return res.status(200).json(orders || []);
  }
);
