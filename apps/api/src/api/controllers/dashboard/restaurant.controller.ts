import { Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";

export const addRestaurant = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const check = await Restaurant.findOne({ userId: req.user.id });

    if (check) throw new ApiError(409, "Restaurant Created Already");
    const restaurant = await new Restaurant({
      userId: req.user.id,
      ...req.body,
    });
    await restaurant.save();
    return res.status(200).json(restaurant);
  }
);

export const getRestaurant = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.findOne({
      userId: req.user.id,
    }).populate("menu");
    return res.status(200).json(restaurant || {});
  }
);

export const modifyRestaurant = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!restaurant) throw new ApiError(404, "restaurant not found.");
    return res.status(200).json({ success: true, ...restaurant.toObject() });
  }
);

export const deleteRestaurant = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.findOne({
      userId: req.user.id,
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
          for (let categoire of menu.categories) {
            if (categoire.items) {
              for (let item of categoire.items) {
                await item.deleteOne();
              }
            }
            await categoire.deleteOne();
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
