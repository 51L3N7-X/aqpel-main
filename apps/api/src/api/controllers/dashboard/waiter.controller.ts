import { RequestWithUser } from "../../../types/controllers";
import type { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  createWaiter,
  deleteWaiterById,
  getUserWaiters,
  getWaiterById,
  updateWaiterById,
} from "../../services/waiter.service";
import httpStatus from "http-status";

export const addWaiter = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const waiter = await createWaiter({
      userId: req.user.id,
      ...req.body,
    });
    res.status(httpStatus.CREATED).send(waiter);
  }
);

export const getWaiters = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const waiters = await getUserWaiters(req.user.id);
    res.send(waiters);
  }
);

export const getIndivWaiter = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const waiter = await getWaiterById(req.params.waiterId, req.user.id);
    res.send(waiter);
  }
);

export const modifyWaiter = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const waiter = await updateWaiterById(
      req.params.waiterId,
      req.user.id,
      req.body
    );
    res.send(waiter);
  }
);

export const deleteWaiter = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await deleteWaiterById(req.params.waiterId, req.user.id);
    res.status(httpStatus.NO_CONTENT).send();
  }
);
