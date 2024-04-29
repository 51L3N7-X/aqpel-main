import { Item } from "../../models/item";
import { Category } from "../../models/category";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { RequestWithUser } from "../../../types/controllers";
import { Response } from "express";
import { ApiError } from "../../utils/ApiError";
import httpStatus from "http-status";
import {
  createFloor as create,
  deleteFloorById,
  getFloorById,
  getUserFloors,
  updateFloorById,
} from "../../services/floor.service";

export const createFloor = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const floor = await create({
      userId: req.user.id,
      ...req.body,
    });
    res.status(httpStatus.CREATED).send(floor);
  }
);

export const getIndivFloor = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const floor = await getFloorById(req.params.floorId, req.user.id);
    res.send(floor);
  }
);

export const getFloors = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const floors = await getUserFloors(req.user.id);
    res.send(floors);
  }
);

export const modifyFloor = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const floor = await updateFloorById(
      req.params.floorId,
      req.user.id,
      req.body
    );
    res.send(floor);
  }
);

export const deleteFloor = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await deleteFloorById(req.params.floorId, req.user.id);
    res.status(httpStatus.NO_CONTENT).send();
  }
);
