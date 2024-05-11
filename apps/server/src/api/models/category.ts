import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  userId: { type: Schema.Types.ObjectId, required: true },
  menuId: { type: Schema.Types.ObjectId, required: true },
  imageUrl: {
    type: String,
  },
  description: String,
  restaurantId: { type: Schema.Types.ObjectId },
});

categorySchema.plugin(toJSON);

export const Category = mongoose.model("Category", categorySchema);
