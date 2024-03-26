import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";
import { ApiError } from "../utils/ApiError";

const menuSchema = new mongoose.Schema({
  categories: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    private: true,
  },
  name: {
    type: String,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  restaurantId: { type: mongoose.Schema.ObjectId, required: true },
  imageUrl: String,
});

menuSchema.plugin(toJSON);

menuSchema.pre("save", async function (next) {
  const menu = this; // refers to the current restaurant being saved
  const duplicate = await Menu.findOne({
    name: menu.name,
    userId: menu.userId,
  });

  if (duplicate && duplicate._id.toString() !== menu._id.toString())
    throw new ApiError(400, "User already has a menu with the same name");

  next();
});

export const Menu = mongoose.model("Menu", menuSchema);
