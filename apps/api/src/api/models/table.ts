import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    restaurant_name: {
      type: String,
      required: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    place: String,
    sendTo: String,
    code: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  }
  // {
  //   unique: true,
  //   indexes: [
  //     {
  //       unique: true,
  //       keys: {
  //         number: 1,
  //         userId: 1,
  //       },
  //     },
  //   ],
  // }
);

tableSchema.plugin(toJSON);

export const Table = mongoose.model("Table", tableSchema);
