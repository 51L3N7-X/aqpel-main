import httpStatus from "http-status";
import { Table } from "../models/table";
import { ApiError } from "../utils/ApiError";

export const createTable = async (body: Table) => {
  return Table.create(body);
};

export const getTableById = async (id: string, userId: string) => {
  const table = await Table.findOne({ _id: id, userId });
  if (!table || !Object.keys(table).length)
    throw new ApiError(404, "Table not found");
  return table;
};

export const getUserTablesByFloor = async (userId: string, floorId: string) => {
  const table = await Table.find({ userId, floorId })
    .sort({ number: 1 })
    .collation({ locale: "en_US", numericOrdering: true });
  return table;
};

export const getTableByNumber = async (
  number: string,
  userId: string,
  floorId: string
) => {
  const table = await Table.findOne({ number, userId, floorId });
  if (!table || !Object.keys(table).length)
    throw new ApiError(404, "Table not found");
  return table;
};

export const updateTableById = async (
  id: string,
  userId: string,
  body: Table
) => {
  const table = await Table.findOne({ userId, _id: id });
  if (!table) throw new ApiError(httpStatus.NOT_FOUND, "Table not found");
  Object.assign(table, body);
  await table.save();
  return table;
};

export const deleteTableById = async (id: string, userId: string) => {
  const table = await Table.findOne({ userId, _id: id });
  if (!table) throw new ApiError(httpStatus.NOT_FOUND, "Table not found");
  await table.deleteOne();
  return table;
};
