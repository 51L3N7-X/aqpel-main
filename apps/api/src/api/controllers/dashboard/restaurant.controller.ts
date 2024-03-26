import { Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import httpStatus from "http-status";
import { updateRestaurantById } from "../../services/restaurant.service";

export const addRestaurant = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    // const check = await Restaurant.findOne({ userId: req.user.id });

    // if (check) throw new ApiError(409, "Restaurant Created Already");
    const restaurant = await new Restaurant({
      userId: req.user.id,
      ...req.body,
    });
    await restaurant.save();
    return res.status(httpStatus.CREATED).json(restaurant);
  }
);

export const getRestaurants = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.find({
      userId: req.user.id,
    });
    if (!restaurant)
      throw new ApiError(httpStatus.NOT_FOUND, "Restaurant not found");
    return res.status(200).json(restaurant);
  }
);

export const getIndividualRestaurant = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.findOne({
      _id: req.params.restaurantId,
      userId: req.user.id,
    });
    if (!restaurant)
      throw new ApiError(httpStatus.NOT_FOUND, "Restaurant not found");
    return res.status(200).json(restaurant);
  }
);

export const modifyRestaurant = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await updateRestaurantById(
      req.params.restaurantId,
      req.user.id,
      req.body
    );
    return res.send(restaurant);
  }
);

export const deleteRestaurant = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.findOne({
      userId: req.user.id,
      _id: req.params.restaurantId,
    }).populate({
      path: "menus",
      populate: {
        path: "categories",
        populate: {
          path: "items",
        },
      },
    });
    if (!restaurant) throw new ApiError(404, "Restaurant not found.");

    if (restaurant.menus) {
      for (let menu of restaurant.menus) {
        //@ts-ignore
        if (menu.categories) {
          //@ts-ignore
          for (let category of menu.categories) {
            if (category.items) {
              for (let item of category.items) {
                await item.deleteOne();
              }
            }
            await category.deleteOne();
          }
        }

        //@ts-ignore
        await menu.deleteOne();
      }
    }
    await restaurant.deleteOne();
    return res.send({ success: true });
  }
);
