import { Menu } from "../../models/menu";
import { Category } from "../../models/category";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { RequestWithUser } from "../../../types/controllers";
import { Response } from "express";
import { ApiError } from "../../utils/ApiError";
import httpStatus from "http-status";

export const addCategory = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const menu = await Menu.findOne({
      _id: req.params.menuId,
      userId: req.user.id,
    });
    if (!menu) throw new ApiError(httpStatus.NOT_FOUND, "Menu not found");

    const category = await new Category({
      userId: req.user.id,
      menuId: menu._id,
      restaurant_id: req.params.restaurantId,
      ...req.body,
    });

    menu.categories.push(category._id);
    await category.save();
    await menu.save();
    return res.status(httpStatus.CREATED).send(category);
  }
);

export const getCategories = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const categories = await Category.find({
      menuId: req.params.menuId,
      userId: req.user.id,
    });
    if (!categories.length) throw new ApiError(404, "Categories not found");
    return res.status(httpStatus.OK).send(categories);
  }
);

export const getIndivCategory = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const category = await Category.findOne({
      userId: req.user.id,
      _id: req.params.categoryId,
    });
    if (!category) throw new ApiError(404, "Category not found");
    return res.send(category);
  }
);

export const modifyCategory = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const category = await Category.findOne({
      _id: req.params.categoryId,
      userId: req.user.id,
    });
    if (!category)
      throw new ApiError(httpStatus.NOT_FOUND, "category not found.");
    Object.assign(category, req.body);
    await category.save();
    res.send(category);
  }
);

export const deleteCategory = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const category = await Category.findOne({
      _id: req.params.categoryId,
      userId: req.user.id,
    }).populate("items");

    if (!category)
      throw new ApiError(httpStatus.NOT_FOUND, "category not found.");

    for (let item of category.items) {
      //@ts-ignore
      await item.deleteOne();
    }

    await category.deleteOne();
    await Menu.updateOne(
      { _id: req.params.menuId },
      { $pull: { categories: req.params.categoryId } }
    );
    return res.status(httpStatus.NO_CONTENT).send();
  }
);
