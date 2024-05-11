import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";
import { ApiError } from "../utils/ApiError";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  currency: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  menus: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
    private: true,
  },
});

restaurantSchema.plugin(toJSON);

restaurantSchema.pre("save", async function (next) {
  const restaurant = this; // refers to the current restaurant being saved
  const duplicate = await Restaurant.findOne({
    name: restaurant.name,
    userId: restaurant.userId,
  });

  if (duplicate && duplicate._id.toString() !== restaurant._id.toString())
    throw new ApiError(400, "User already has a restaurant with the same name");

  next();
});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
