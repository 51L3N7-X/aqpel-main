import type { Socket } from "socket.io";
import { fromUser } from "./FromUser";
import Joi from "joi";
import { orderValidate as orderSchema } from "../../api/validations/public";
import { Order as OrderType } from "../types/order";
import { Table } from "../../api/models/table";
import { Order } from "../../api/models/order";
import mongoose from "mongoose";
// import redis from "redis";

const connection = (socket: Socket, io: any) => {
  console.log("user connected");

  socket.on("subscribe", (roomId: string | string[]) => {
    if (Array.isArray(roomId)) {
      socket.join(roomId);
    } else {
      socket.join(String(roomId));
    }

    // io.to("test").emit("ttt", "hello");
    console.log("joined room", roomId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected with id : " + socket.id);
  });

  socket.on("order:create", async (order: OrderType) => {
    console.log(order);
    try {
      const { value, error } = Joi.compile(orderSchema.body)
        .prefs({ errors: { label: "key" } })
        .validate(order);

      if (error) {
        const errorMessage: any = error.details
          .map((details) => details.message)
          .join(", ");
        throw new Error(errorMessage);
      }

      // const restaurant = await Restaurant.findOne({
      //   _id: order.restaurant_id,
      // });

      // if (!restaurant) throw new Error("Restaurant not found");

      const table = await Table.findOne({ _id: order.table_id });

      if (!table) throw new Error("Table not found");

      const temp_order = await new Order({
        ...order,
        table_number: table.number,
      });
      await temp_order.save();

      io.to(String(temp_order.table_id)).emit("waiter:order", temp_order);

      io.to(String(temp_order.table_id)).emit("user", {
        message: "done",
        success: true,
      });
    } catch (e: any) {
      io.to(String(order.table_id)).emit("user", {
        messasge: e.message,
        success: false,
      });
    }
  });

  socket.on(
    "waiter:orderDone",
    async ({
      orderId,
      name,
      photoUrl,
    }: {
      orderId: any;
      name: string;
      photoUrl: string;
    }) => {
      const order: any = await Order.findOne({
        _id: new mongoose.Types.ObjectId(orderId),
      });
      console.log(order);

      order.done = true;

      await order.save();

      io.to(String(order.table_id)).emit("waiter:notfiyOrderIsDone", {
        name,
        photoUrl,
        _id: order._id,
      });
    }
  );
};

export default connection;
