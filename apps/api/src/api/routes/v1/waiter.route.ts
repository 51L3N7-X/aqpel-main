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
import { validate } from "../../middlewares/validate";
import {
  waiterCreateValidate,
  waiterGetOrDeleteValidate,
  waiterModifyValidate,
} from "../../validations/public";

router.use(auth());

router.post("/", validate(waiterCreateValidate), addWaiter);
router.get("/", getWaiters);
router.get("/:waiterId", validate(waiterGetOrDeleteValidate), getIndivWaiter);
router.patch("/:waiterId", validate(waiterModifyValidate), modifyWaiter);
router.delete("/:waiterId", validate(waiterGetOrDeleteValidate), deleteWaiter);
