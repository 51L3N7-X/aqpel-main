import express from "express";

import {
  login,
  register,
  logout,
  refreshTokens,
} from "../../controllers/dashboard/auth.controller";
import { validate } from "../../middlewares/validate";
import {
  logoutValidate,
  registerValidate,
  refreshTokenValidate,
  loginValidate,
} from "../../validations/public";

export const router = express.Router();
router.post("/register", validate(registerValidate), register);
router.post("/login", validate(loginValidate), login);
router.post("/logout", validate(logoutValidate), logout);
router.post("/refresh-tokens", validate(refreshTokenValidate), refreshTokens);
