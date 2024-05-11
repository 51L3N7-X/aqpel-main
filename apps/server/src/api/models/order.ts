import mongoose from "mongoose";
import { toJSON } from "./plugins/toJson";

const OrderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["order", "waiter", "ember", "bill", "kitchen"],
      required: true,
    },
    order_details: {
      price: String,
      payment_method: String,
      items: [
        {
          name: String,
          count: Number,
          image_url: String,
        },
      ],
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    table_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Table",
    },
    done: { type: Boolean, default: false },
    table_number: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.plugin(toJSON);

export const Order = mongoose.model("Order", OrderSchema);
