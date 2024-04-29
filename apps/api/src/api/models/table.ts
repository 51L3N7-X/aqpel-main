import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";
import { ApiError } from "../utils/ApiError";

// const tableSchema = new mongoose.Schema(
//   {
//     number: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//     },
//     restaurant_name: {
//       type: String,
//       required: true,
//     },
//     restaurant_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Restaurant",
//     },
//     sendTo: String,
//     code: String,
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//   }
//   // {
//   //   unique: true,
//   //   indexes: [
//   //     {
//   //       unique: true,
//   //       keys: {
//   //         number: 1,
//   //         userId: 1,
//   //       },
//   //     },
//   //   ],
//   // }
// );

export interface Table {
  number: string;
  chairs: string;
  shape: "square" | "circle";
  restaurantId: string;
  restaurant_name: string;
  userId: string;
  floorId: string;
}

const tableSchema = new mongoose.Schema<Table>({
  number: {
    type: String,
    required: true,
  },
  chairs: {
    type: String,
    default: "2",
  },
  shape: {
    type: String,
    default: "square",
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Restaurant",
  } as unknown as string,
  restaurant_name: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  } as unknown as string,
  floorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  } as unknown as string,
});

tableSchema.plugin(toJSON);

tableSchema.pre("save", async function (next) {
  const table = this as unknown as Table;
  const exist = await Table.findOne({
    number: table.number,
    userId: table.userId,
    floorId: table.floorId,
    //@ts-ignore
    _id: { $ne: table._id },
  });
  if (exist)
    throw new ApiError(400, "Table with the same number already exists");

  return next();
});

export const Table = mongoose.model("Table", tableSchema);
