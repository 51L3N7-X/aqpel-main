import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";

const menuSchema = new mongoose.Schema({
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  name: {
    type: String,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  restaurantId: { type: mongoose.Schema.ObjectId, required: true },
});

menuSchema.plugin(toJSON);

export const Menu = mongoose.model("Menu", menuSchema);
