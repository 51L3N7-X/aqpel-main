import { Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { Menu } from "../../models/menu";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";

export const addMenu = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const check = await Menu.findOne({
      restaurantId: req.params.restaurantId,
      userId: req.user.id,
    });

    if (check) throw new ApiError(409, "Menu Created Already");

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) throw new ApiError(404, "Restaurant not found.");

    const menu = await new Menu({
      restaurantId: req.params.restaurantId,
      userId: req.user.id,
      ...req.body,
    });

    restaurant.menus.push(menu._id);

    await menu.save();
    await restaurant.save();

    return res.status(200).json(menu);
  }
);

export const getMenus = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const menu = await Menu.find({
      restaurantId: req.params.restaurantId,
      userId: req.user.id,
    });
    return res.status(200).json(menu || {});
  }
);

export const modifyMenu = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const menu = await Menu.findOneAndUpdate(
      { restaurantId: req.params.restaurantId, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!menu) throw new ApiError(404, "menu not found.");
    return res.status(200).json({ success: true, ...menu.toObject() });
  }
);

export const deleteMenu = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const menu = await Menu.findOne({
      restaurantId: req.params.restaurantId,
      userId: req.user.id,
    }).populate({
      path: "categories",
      populate: {
        path: "items",
      },
    });

    if (!menu) throw new ApiError(404, "Menu not found.");

    for (let categoire of menu.categories) {
      //@ts-ignore
      for (let item of categoire.items) {
        await item.deleteOne();
      }
      //@ts-ignore
      await categoire.deleteOne();
    }

    await menu.deleteOne();
    return res.send({ success: true });
  }
);
