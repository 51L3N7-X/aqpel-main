import { Menu } from "../../models/menu";
import { Category } from "../../models/categorie";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { RequestWithUser } from "../../../types/controllers";
import { Response } from "express";
import { ApiError } from "../../utils/ApiError";
import httpStatus from "http-status";

export const addCategorie = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) throw new ApiError(httpStatus.NOT_FOUND, "Menu not found");
    const restaurant = await Restaurant.findOne({ userId: req.user.id });
    if (!restaurant)
      throw new ApiError(httpStatus.NOT_FOUND, "restaruant not found.");

    const categorie = await new Category({
      userId: req.user.id,
      menuId: req.params.menuId,
      restaurant_id: restaurant._id,
      ...req.body,
    });

    menu.categories.push(categorie._id);
    await categorie.save();
    await menu.save();
    return res.status(httpStatus.OK).json(categorie);
  }
);

export const getCategories = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const categories = await Category.find({
      menuId: req.params.menuId,
      userId: req.user.id,
    }).populate("items");
    return res.status(httpStatus.OK).json(categories || {});
  }
);

export const getIndivCategorie = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const categorie = await Category.findOne({
      userId: req.user.id,
      _id: req.params.categorieId,
    });
    return res.status(httpStatus.OK).json(categorie || {});
  }
);

export const modifyCategorie = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const categorie = await Category.findOneAndUpdate(
      { _id: req.params.categorieId, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!categorie)
      throw new ApiError(httpStatus.NOT_FOUND, "category not found.");
    return res
      .status(httpStatus.OK)
      .json({ success: true, ...categorie.toObject() });
  }
);

export const deleteCategorie = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const categoire = await Category.findOne({
      _id: req.params.categorieId,
      userId: req.user.id,
    }).populate("items");

    if (!categoire)
      throw new ApiError(httpStatus.NOT_FOUND, "category not found.");

    for (let item of categoire.items) {
      //@ts-ignore
      await item.deleteOne();
    }

    await categoire.deleteOne();
    await Menu.updateOne(
      { _id: req.params.menuId },
      { $pull: { categories: req.params.categorieId } }
    );
    return res.status(httpStatus.NO_CONTENT).send();
  }
);
