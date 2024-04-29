import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";
import { ApiError } from "../utils/ApiError";

export interface Floor {
  number: string;
  tables: string[];
  userId: string;
}

const floorSchema = new mongoose.Schema<Floor>({
  number: String,
  tables: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
    private: true,
  } as unknown as string[],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  } as unknown as string,
});

floorSchema.plugin(toJSON);

floorSchema.pre("save", async function (next) {
  const floor = this as unknown as Floor;
  const exist = await Floor.findOne({
    number: floor.number,
    userId: floor.userId,
    //@ts-ignore
    _id: { $ne: floor._id },
  });
  if (exist)
    throw new ApiError(400, "Floor with the same number already exists");

  return next();
});

export const Floor = mongoose.model<Floor>("Floor", floorSchema);
