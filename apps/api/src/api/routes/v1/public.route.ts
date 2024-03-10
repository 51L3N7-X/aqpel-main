import express from "express";
import {
  getTableOnly,
  getMenu,
} from "../../controllers/public/getTables.controller";
import { postOrder } from "../../controllers/public/order.controller";
import { validate } from "../../middlewares/validate";
import { orderValidate } from "../../validations/public";
import { getItem, getItems } from "../../controllers/public/getItem.controller";
import { getCategories } from "../../controllers/public/getCategories.controller";

export const router = express.Router();

router.post("/order", validate(orderValidate), postOrder);
router.get("/:tableId", getTableOnly);
router.get("/:restaurantId/menu", getMenu);
router.get("/item/:itemId", getItem);
router.get("/:restaurantId/items", getItems);
router.get("/:restaurantId/categories", getCategories);
