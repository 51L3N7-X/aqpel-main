import { Request, Response } from "express";
import { RequestWithUser } from "../../../types/controllers";
import { Order } from "../../models/order";
import { Restaurant } from "../../models/restaurant";
import { Table } from "../../models/table";
import { ApiError } from "../../utils/ApiError";

export const postOrder = async (req: Request, res: Response) => {
  const restaurant = await Restaurant.findOne({
    _id: req.body.restaurant_id,
  });
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  const table = await Table.findOne({ _id: req.body.table_id });
  if (!table || Number(table.number) !== Number(req.body.table_number))
    throw new ApiError(404, "Table not found");
  const order = await new Order(req.body);
  await order.save();
  return res.status(200).send({ message: "success" });
};
