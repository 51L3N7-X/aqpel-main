import mongoose from "mongoose";
import { Restaurant } from "../../api/models/restaurant";
import { faker } from "@faker-js/faker";
import { insertUsers, tempUser } from "./auth.fixture";
import { Menu } from "../../api/models/menu";
import { Category } from "../../api/models/category";
import { Item } from "../../api/models/item";

interface Restaurant {
  name: string;
  description?: string;
  currency?: string;
  _id: mongoose.Types.ObjectId;
}

interface Menu {
  name: string;
  _id: string | mongoose.Types.ObjectId;
}

interface Category {
  name: string;
  description?: string;
  _id: string | mongoose.Types.ObjectId;
}

interface Item {
  name: string;
  _id: string | mongoose.Types.ObjectId;
  price: string;
  description?: string;
}

export const insertRestaurants = async (restaurants: Restaurant[]) => {
  await insertUsers([tempUser]);
  await Restaurant.insertMany(restaurants);
};

export const insertMenu = async (menu: Menu[]) => {
  await insertRestaurants([tempRestaurant]);
  await Menu.insertMany(menu);
};

export const insertCategories = async (categories: Category[]) => {
  await insertMenu([tempMenu]);
  await Category.insertMany(categories);
};

export const insertItems = async (items: Item[]) => {
  await insertCategories([tempCategory]);
  await Item.insertMany(items);
};

export const tempRestaurant = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.firstName().toLocaleLowerCase(),
  userId: tempUser._id,
};

export const tempMenu = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.firstName(),
  userId: tempUser._id,
  restaurantId: tempRestaurant._id,
};

export const tempCategory = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.firstName(),
  userId: tempUser._id,
  restaurantId: tempRestaurant._id,
  menuId: tempMenu._id,
};

export const tempItem = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.firstName(),
  userId: tempUser._id,
  price: faker.finance.amount(),
  restaurantId: tempRestaurant._id,
  menuId: tempMenu._id,
  categoryId: tempCategory._id,
};
