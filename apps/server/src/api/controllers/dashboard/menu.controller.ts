import { Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { Menu } from "../../models/menu";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";
import httpStatus from "http-status";

export const addMenu = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.findOne({
      userId: req.user.id,
      _id: req.params.restaurantId,
    });

    if (!restaurant) throw new ApiError(404, "Restaurant not found.");

    const menu = await new Menu({
      restaurantId: req.params.restaurantId,
      userId: req.user.id,
      ...req.body,
    });

    restaurant.menus.push(menu._id);

    await menu.save();
    await restaurant.save();

    return res.status(httpStatus.CREATED).send(menu);
  }
);

export const getMenus = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const menu = await Menu.find({
      restaurantId: req.params.restaurantId,
      userId: req.user.id,
    });

    if (!menu.length) throw new ApiError(404, "Menu not found");
    return res.status(200).json(menu);
  }
);

export const getIndivMenu = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const menu = await Menu.findOne({
      userId: req.user.id,
      _id: req.params.menuId,
      restaurantId: req.params.restaurantId,
    });
    if (!menu) throw new ApiError(httpStatus.NOT_FOUND, "Menu not found");
    return res.send(menu);
  }
);

export const modifyMenu = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const menu = await Menu.findOne({
      restaurantId: req.params.restaurantId,
      userId: req.user.id,
      _id: req.params.menuId,
    });
    if (!menu) throw new ApiError(404, "menu not found.");
    Object.assign(menu, req.body);
    await menu.save();
    return res.send(menu);
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

    for (let category of menu.categories) {
      //@ts-ignore
      for (let item of category.items) {
        await item.deleteOne();
      }
      //@ts-ignore
      await category.deleteOne();
    }

    await menu.deleteOne();
    return res.send({ success: true });
  }
);
