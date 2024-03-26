import httpStatus from "http-status";
import { Restaurant } from "../models/restaurant";
import { ApiError } from "../utils/ApiError";

export const updateRestaurantById = async (
  id: string,
  userId: string,
  updateBody: any
) => {
  const restaurant = await Restaurant.findOne({ _id: id, userId });
  if (!restaurant)
    throw new ApiError(httpStatus.NOT_FOUND, "Restaurant not found");
  Object.assign(restaurant, updateBody);
  await restaurant.save();
  return restaurant;
};
