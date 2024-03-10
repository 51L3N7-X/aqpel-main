import express from "express";
export const router = express.Router();

import {
  addTable,
  getTables,
  getIndivTable,
  modifyTable,
  deleteTable,
} from "../../controllers/dashboard/table.controller";

import { verifyToken } from "../../middlewares/verifyToken";
import { auth } from "../../middlewares/auth";

router.use(auth());

router.post("/", addTable);
router.get("/", getTables);
router.get("/:tableId", getIndivTable);
router.put("/:tableId", modifyTable);
router.delete("/:tableId", deleteTable);
