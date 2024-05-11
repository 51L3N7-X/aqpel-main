import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";
import { ApiError } from "../utils/ApiError";

export interface Waiter {
  username: string;
  password: string;
  name: string;
  photoUrl: string;
  restaurantId: string;
  active: boolean;
  userId: string;
  tables: string[];
}

const waiterSchema = new mongoose.Schema<Waiter>({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  } as unknown as string,
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // receive: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
  name: String,
  photoUrl: String,
  active: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  } as unknown as string,
  tables: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  ] as unknown as string[],
});

waiterSchema.plugin(toJSON);

waiterSchema.pre("save", async function (next) {
  const waiter = this as unknown as Waiter;
  const exist = await Waiter.findOne({
    username: waiter.username,
    userId: waiter.userId,
    //@ts-ignore
    _id: { $ne: waiter._id },
  });
  if (exist)
    throw new ApiError(400, "Waiter with the same username is already exists");

  return next();
});

export const Waiter = mongoose.model("Waiter", waiterSchema);
