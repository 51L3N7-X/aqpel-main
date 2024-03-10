import express from "express";
export const router = express.Router();

import { login } from "../../controllers/app/login.controller";
import { getOrders } from "../../controllers/app/getOrders.controller";

import { getTables } from "../../controllers/app/getTables.controller";
import { auth } from "../../middlewares/auth";

router.post("/login", login);

router.use(auth());

router.get("/getOrders", getOrders);
router.get("/getTables", getTables);
