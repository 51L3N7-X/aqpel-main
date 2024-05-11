import mongoose, { Model } from "mongoose";
import { User } from "../../api/models/user";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { Restaurant } from "../../api/models/restaurant";

const password = "password1";

const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

export const tempUser = {
  _id: new mongoose.Types.ObjectId(),
  username: faker.person.firstName().toLowerCase(),
  email: faker.internet.email().toLowerCase(),
  password,
  verified: false,
  plan: "free",
};

export const tempUser2 = {
  _id: new mongoose.Types.ObjectId(),
  username: faker.person.firstName().toLowerCase(),
  email: faker.internet.email().toLowerCase(),
  password,
  verified: false,
  plan: "free",
};

export const insertUsers = async (users: any[]) => {
  await User.insertMany(
    users.map((user) => ({ ...(user as object), password: hashedPassword }))
  );
};
