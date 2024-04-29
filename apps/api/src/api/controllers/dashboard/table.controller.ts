import { Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { Table } from "../../models/table";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import {
  createTable,
  deleteTableById,
  getTableById,
  getUserTablesByFloor,
  updateTableById,
} from "../../services/table.service";
import httpStatus from "http-status";
import { Floor } from "../../models/floor";

export const addTable = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const table = await createTable({
      userId: req.user.id,
      floorId: req.params.floorId,
      ...req.body,
    });
    const floor = await Floor.findOne({
      _id: req.params.floorId,
      userId: req.user.id,
    });
    floor?.tables.push(table.id);
    await floor?.save();
    return res.status(httpStatus.CREATED).send(table);
  }
);

export const getTables = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const tables = await getUserTablesByFloor(req.user.id, req.params.floorId);
    return res.send(tables);
  }
);

export const getIndivTable = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const table = await getTableById(req.params.tableId, req.user.id);
    return res.send(table);
  }
);

export const modifyTable = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const table = await updateTableById(
      req.params.tableId,
      req.user.id,
      req.body
    );
    return res.send(table);
  }
);

export const deleteTable = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await deleteTableById(req.params.tableId, req.user.id);
    const floor = await Floor.findOne({
      _id: req.params.floorId,
      userId: req.user.id,
    });
    const index = floor?.tables.indexOf(req.params.tableId);
    if (index) floor?.tables.splice(index, 1);
    await floor?.save();
    res.status(httpStatus.NO_CONTENT).send();
  }
);
