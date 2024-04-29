import mongoose from "mongoose";
import { tempUser } from "./auth.fixture";
import { Floor } from "../../api/models/floor";

export const tempFloor = {
  number: 1,
  _id: new mongoose.Types.ObjectId(),
  userId: tempUser._id,
};

export const insertTheFloor = async () => {
  await Floor.insertMany([tempFloor]);
};
