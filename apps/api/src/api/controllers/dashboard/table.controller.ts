import { Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { Table } from "../../models/table";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";

export const addTable = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const table = await new Table({ userId: req.user.id, ...req.body });
    await table.save();
    return res.status(200).json(table);
  }
);

export const getTables = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const tables = await Table.find({
      userId: req.user.id,
    });
    return res.status(200).json(tables || {});
  }
);

export const getIndivTable = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const table = await Table.findOne({
      userId: req.user.id,
      _id: req.params.tableId,
    });
    return res.status(200).json(table || {});
  }
);

export const modifyTable = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const table = await Table.findOneAndUpdate(
      { _id: req.params.tableId, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!table) throw new ApiError(404, "table not found.");
    return res.status(200).json({ success: true, ...table.toObject() });
  }
);

export const deleteTable = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await Table.deleteOne({
      _id: req.params.tableId,
      userId: req.user.id,
    });
    return res.send({ success: true });
  }
);
