import httpStatus from "http-status";
import { Floor } from "../models/floor";
import { ApiError } from "../utils/ApiError";

export const createFloor = async (body: Floor) => {
  return Floor.create(body);
};

export const getFloorById = async (id: string, userId: string) => {
  const floor = await Floor.findOne({ _id: id, userId });
  if (!floor || !Object.keys(floor).length)
    throw new ApiError(404, "Floor not found");
  return floor;
};

export const getUserFloors = async (userId: string) => {
  const floor = await Floor.find({ userId })
    .sort({ number: 1 })
    .collation({ locale: "en_US", numericOrdering: true });
  return floor;
};

export const getFloorsWithTables = async (userId: string) => {
  const floors = await Floor.find({ userId }).populate({
    path: "tables",
    select: {
      number: 1,
      id: 1,
    },
  });

  return floors;
};

export const getFloorByNumber = async (number: string, userId: string) => {
  const floor = await Floor.findOne({ number, userId });
  if (!floor || !Object.keys(floor).length)
    throw new ApiError(404, "Floor not found");
  return floor;
};

export const updateFloorById = async (
  id: string,
  userId: string,
  body: Floor
) => {
  const floor = await Floor.findOne({ userId, _id: id });
  if (!floor || !Object.keys(floor).length)
    throw new ApiError(httpStatus.NOT_FOUND, "Floor not found");
  Object.assign(floor, body);
  await floor.save();
  return floor;
};

export const deleteFloorById = async (id: string, userId: string) => {
  const floor = await Floor.findOne({ userId, _id: id });
  if (!floor || !Object.keys(floor).length)
    throw new ApiError(httpStatus.NOT_FOUND, "Floor not found");
  await floor.deleteOne();
  return floor;
};
