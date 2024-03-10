import express from "express";
export const router = express.Router();

import {
  getUser,
  modifyUser,
  deleteUser,
} from "../../controllers/dashboard/user.controller";

import { auth } from "../../middlewares/auth";

//verify
router.use(auth());

// main requests for user
router.get("/", getUser);
router.put("/", modifyUser);
router.delete("/", deleteUser);
