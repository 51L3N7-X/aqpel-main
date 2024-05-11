import { Item } from "../../models/item";
import { Category } from "../../models/category";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { RequestWithUser } from "../../../types/controllers";
import { Response } from "express";
import { ApiError } from "../../utils/ApiError";
import httpStatus from "http-status";

export const addItem = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const category = await Category.findOne({
      userId: req.user.id,
      _id: req.params.categoryId,
    });
    if (!category)
      throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    const item = new Item({
      userId: req.user.id,
      categoryId: req.params.categoryId,
      restaurantId: req.params.restaurantId,
      ...req.body,
    });

    category.items.push(item._id);
    await item.save();
    await category.save();
    res.status(201).send(item);
  }
);

export const getIndivItem = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const item = await Item.findOne({
      _id: req.params.itemId,
      userId: req.user.id,
    });
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
    return res.send(item);
  }
);

export const getItems = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const items = await Item.find({
      userId: req.user.id,
      categoryId: req.params.categoryId,
    });
    if (!items.length)
      throw new ApiError(httpStatus.NOT_FOUND, "Items not found");
    return res.send(items);
  }
);

export const modifyItem = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const item = await Item.findOne({
      userId: req.user.id,
      _id: req.params.itemId,
    });
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
    Object.assign(item, req.body);
    await item.save();
    return res.send(item);
  }
);

export const deleteItem = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await Item.deleteOne({
      _id: req.params.itemId,
      userId: req.user.id,
    });
    await Category.updateOne(
      { _id: req.params.categoryId },
      { $pull: { items: req.params.itemId } }
    );
    return res.send({ success: true });
  }
);
