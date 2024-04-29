import mongoose from "mongoose";
import { tempUser } from "./auth.fixture";
import { insertRestaurants, tempRestaurant } from "./restaurant.fixture";
import { insertTheFloor, tempFloor } from "./floor.fixture";
import { Table } from "../../api/models/table";

export const tempTable = {
  number: 1,
  _id: new mongoose.Types.ObjectId(),
  userId: tempUser._id,
  restaurantId: tempRestaurant._id,
  floorId: tempFloor._id,
};

export const insertTheTable = async () => {
  await insertRestaurants([tempRestaurant]);
  await insertTheFloor();
  await Table.insertMany([tempTable]);
};
