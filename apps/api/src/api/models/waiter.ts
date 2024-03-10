import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";

const waiterSchema = new mongoose.Schema({
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
  receive: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
  name: String,
  photoUrl: String,
  active: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
});

waiterSchema.plugin(toJSON);

// Create compound index on "username" and "userId"
// waiterSchema.index({ username: 1, userId: 1 }, { unique: true });

// // Create compound index on "password" and "userId"
// waiterSchema.index({ password: 1, userId: 1 }, { unique: true });

export const Waiter = mongoose.model("Waiter", waiterSchema);
