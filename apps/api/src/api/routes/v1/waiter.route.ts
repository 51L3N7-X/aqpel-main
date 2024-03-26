import express from "express";
export const router = express.Router();
import {
  addWaiter,
  getWaiters,
  getIndivWaiter,
  modifyWaiter,
  deleteWaiter,
} from "../../controllers/dashboard/waiter.controller";

import { auth } from "../../middlewares/auth";

router.use(auth());

router.post("/", addWaiter);
router.get("/", getWaiters);
router.get("/:waiterId", getIndivWaiter);
router.patch("/:waiterId", modifyWaiter);
router.delete("/:waiterId", deleteWaiter);
