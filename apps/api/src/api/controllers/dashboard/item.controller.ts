import { Item } from "../../models/item";
import { Category } from "../../models/categorie";
import { Restaurant } from "../../models/restaurant";
import { catchAsync } from "../../utils/catchAsync";
import { RequestWithUser } from "../../../types/controllers";
import { Response } from "express";
import { ApiError } from "../../utils/ApiError";

export const addItem = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const restaurant = await Restaurant.findOne({ userId: req.user.id });
    if (!restaurant) throw new ApiError(404, "Restaurnat not found.");
    const categorie = await Category.findById(req.params.categorieId);
    if (!categorie) throw new Error("Categoire not found");
    const item = await new Item({
      userId: req.user.id,
      menuId: req.params.menuId,
      categorieId: req.params.categorieId,
      restaurant_id: restaurant._id,
      ...req.body,
    });
    categorie.items.push(item._id);
    await categorie.save();
    await item.save();
    return res.status(200).json(item);
  }
);

export const getIndivItem = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const item = await Item.findOne({
      _id: req.params.itemId,
      userId: req.user.id,
    });
    return res.status(200).json(item || {});
  }
);

export const getItems = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const items = await Item.find({
      userId: req.user.id,
      categorieId: req.params.categorieId,
    });
    return res.status(200).json(items || {});
  }
);

export const modifyItem = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.itemId, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!item) throw new ApiError(404, "item not found.");
    return res.status(200).json({ success: true, ...item.toObject() });
  }
);

export const deleteItem = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await Item.deleteOne({
      _id: req.params.itemId,
      userId: req.user.id,
    });
    await Category.updateOne(
      { _id: req.params.categorieId },
      { $pull: { items: req.params.itemId } }
    );
    return res.send({ success: true });
  }
);
