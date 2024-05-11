import mongoose from "mongoose";
import { Schema } from "mongoose";
import { toJSON } from "./plugins/toJson";
import { required } from "joi";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  calories: Number,
  people: Number,
  new: Boolean,
  special: Boolean,
  imageUrl: String,
  userId: { type: Schema.Types.ObjectId },
  menuId: { type: Schema.Types.ObjectId },
  categoryId: { type: Schema.Types.ObjectId },
  restaurantId: { type: Schema.Types.ObjectId, required: true },
});

itemSchema.plugin(toJSON);

export const Item = mongoose.model("Item", itemSchema);
