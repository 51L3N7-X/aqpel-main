import express from "express";
export const router = express.Router();
import {
  addMenu,
  getMenus,
  deleteMenu,
  modifyMenu,
  getIndivMenu,
} from "../../controllers/dashboard/menu.controller";

import {
  addCategory,
  getCategories,
  getIndivCategory,
  modifyCategory,
  deleteCategory,
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
  getRestaurants,
  modifyRestaurant,
  deleteRestaurant,
  getIndividualRestaurant,
} from "../../controllers/dashboard/restaurant.controller";
import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import {
  categoryCreateValidate,
  categoryDeleteValidate,
  categoryGetValidate,
  categoryModifyValidate,
  menuCreateValidate,
  menuDeleteValidate,
  menuGetValidate,
  menuModifyValidate,
  restaurantGetOrDeleteValidate,
  restaurantUpdateValidate,
  restaurantCreateValidate,
  itemCreateValidate,
  itemGetValidate,
  itemModifyValidate,
} from "../../validations/public";

router.use(auth());

//restaurant
router.post("/", validate(restaurantCreateValidate), addRestaurant);
router.get("/", getRestaurants);
router.get(
  "/:restaurantId",
  validate(restaurantGetOrDeleteValidate),
  getIndividualRestaurant
);
router.patch(
  "/:restaurantId",
  validate(restaurantUpdateValidate),
  modifyRestaurant
);
router.delete(
  "/:restaurantId",
  validate(restaurantGetOrDeleteValidate),
  deleteRestaurant
);

//menus
router.post("/:restaurantId/menu", validate(menuCreateValidate), addMenu);
router.get("/:restaurantId/menu", getMenus);
router.get(
  "/:restaurantId/menu/:menuId",
  validate(menuGetValidate),
  getIndivMenu
);
router.patch(
  "/:restaurantId/menu/:menuId",
  validate(menuModifyValidate),
  modifyMenu
);
router.delete(
  "/:restaurantId/menu/:menuId",
  validate(menuDeleteValidate),
  deleteMenu
);

//categories
router.post(
  "/:restaurantId/menu/:menuId/category",
  validate(categoryCreateValidate),
  addCategory
);
router.get("/:restaurantId/menu/:menuId/category", getCategories);
router.get(
  "/:restaurantId/menu/:menuId/category/:categoryId",
  validate(categoryGetValidate),
  getIndivCategory
);
router.patch(
  "/:restaurantId/menu/:menuId/category/:categoryId",
  validate(categoryModifyValidate),
  modifyCategory
);
router.delete(
  "/:restaurantId/menu/:menuId/category/:categoryId",
  validate(categoryDeleteValidate),
  deleteCategory
);

//items
router.post(
  "/:restaurantId/menu/:menuId/category/:categoryId/item",
  validate(itemCreateValidate),
  addItem
);
router.get("/:restaurantId/menu/:menuId/category/:categoryId/item", getItems);
router.get(
  "/:restaurantId/menu/:menuId/category/:categoryId/item/:itemId",
  validate(itemGetValidate),
  getIndivItem
);
router.patch(
  "/:restaurantId/menu/:menuId/category/:categoryId/item/:itemId",
  validate(itemModifyValidate),
  modifyItem
);
router.delete(
  "/:restaurantId/menu/:menuId/category/:categoryId/item/:itemId",
  validate(itemGetValidate),
  deleteItem
);
