import mongoose from "mongoose";
import { Schema } from "mongoose";
import { toJSON } from "./plugins/toJson";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: String,
  calories: String,
  people: Number,
  new: Boolean,
  special: Boolean,
  imageUrl: String,
  userId: { type: Schema.Types.ObjectId },
  menuId: { type: Schema.Types.ObjectId },
  categorieId: { type: Schema.Types.ObjectId },
  restaurant_id: { type: Schema.Types.ObjectId },
});

itemSchema.plugin(toJSON);

export const Item = mongoose.model("Item", itemSchema);
