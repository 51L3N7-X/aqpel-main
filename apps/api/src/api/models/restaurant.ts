import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  currency: String,
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
});

restaurantSchema.index({ name: 1, userId: 1 }, { unique: true });

restaurantSchema.plugin(toJSON);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
