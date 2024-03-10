import express from "express";
export const router = express.Router();
import {
  addMenu,
  getMenus,
  deleteMenu,
  modifyMenu,
} from "../../controllers/dashboard/menu.controller";

import { verifyToken } from "../../middlewares/verifyToken";

import {
  addCategorie,
  getCategories,
  getIndivCategorie,
  modifyCategorie,
  deleteCategorie,
} from "../../controllers/dashboard/category.controller";

import {
  addItem,
  getIndivItem,
  getItems,
  modifyItem,
  deleteItem,
} from "../../controllers/dashboard/item.controller";

import {
  addRestaurant,
  getRestaurant,
  modifyRestaurant,
  deleteRestaurant,
} from "../../controllers/dashboard/restaurant.controller";
import { auth } from "../../middlewares/auth";

router.use(auth());

router.post("/", addRestaurant);
router.get("/", getRestaurant);
router.put("/", modifyRestaurant);
router.delete("/", deleteRestaurant);

router.post("/:restaurantId/menu", addMenu);
router.get("/:restaurantId/menu", getMenus);
router.put("/:restaurantId/menu", modifyMenu);
router.delete("/:restaurantId/menu", deleteMenu);

router.post("/:restaurantId/menu/:menuId/categories", addCategorie);
router.get("/:restaurantId/menu/:menuId/categories", getCategories);
router.get(
  "/:restaurantId/menu/:menuId/categories/:categorieId",
  getIndivCategorie
);
router.put(
  "/:restaurantId/menu/:menuId/categories/:categorieId",
  modifyCategorie
);
router.delete(
  "/:restaurantId/menu/:menuId/categories/:categorieId",
  deleteCategorie
);

router.post(
  "/:restaurantId/menu/:menuId/categories/:categorieId/items",
  addItem
);
router.get(
  "/:restaurantId/menu/:menuId/categories/:categorieId/items",
  getItems
);
router.get(
  "/:restaurantId/menu/:menuId/categories/:categorieId/items/:itemId",
  getIndivItem
);
router.put(
  "/:restaurantId/menu/:menuId/categories/:categorieId/items/:itemId",
  modifyItem
);
router.delete(
  "/:restaurantId/menu/:menuId/categories/:categorieId/items/:itemId",
  deleteItem
);
