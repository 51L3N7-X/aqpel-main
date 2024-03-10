import express from "express";
export const router = express.Router();

import {
  addKitchen,
  getTheKitchen,
  modifyKitchen,
  deleteKitchen,
} from "../../controllers/dashboard/kitchen.controller";
import { auth } from "../../middlewares/auth";

router.use(auth());

router.post("/", addKitchen);
router.get("/", getTheKitchen);
router.put("/", modifyKitchen);
router.delete("/", deleteKitchen);
