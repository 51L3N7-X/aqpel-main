import httpStatus from "http-status";
import { Table } from "../models/table";
import { ApiError } from "../utils/ApiError";
import { Restaurant } from "../models/restaurant";

export const createTable = async (body: Table) => {
  const restaurant = await Restaurant.findOne({
    _id: body.restaurantId,
    userId: body.userId,
  });
  if (!restaurant || !Object.keys(restaurant).length)
    throw new ApiError(httpStatus.BAD_REQUEST, "Restaurant not found");
  const table = await Table.create(body);
  return table;
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
  if (!table || !Object.keys(table).length)
    throw new ApiError(httpStatus.NOT_FOUND, "Table not found");
  const restaurant = await Restaurant.findOne({
    _id: body.restaurantId,
    userId,
  });
  if (!restaurant || !Object.keys(restaurant).length)
    throw new ApiError(httpStatus.BAD_REQUEST, "Restaurant not found");
  Object.assign(table, body);
  await table.save();
  return table;
};

export const deleteTableById = async (id: string, userId: string) => {
  const table = await Table.findOne({ userId, _id: id });
  if (!table || !Object.keys(table).length)
    throw new ApiError(httpStatus.NOT_FOUND, "Table not found");
  await table.deleteOne();
  return table;
};
