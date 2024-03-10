import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";
const Schema = mongoose.Schema;

const kitchenSchema = new mongoose.Schema({
  restaurant_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

kitchenSchema.plugin(toJSON);

export const Kitchen = mongoose.model("Kitchen", kitchenSchema);
