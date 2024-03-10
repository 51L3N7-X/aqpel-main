import express from "express";

import { getS3Url } from "../../services/getS3Url";
import { auth } from "../../middlewares/auth";

import { router as userRouter } from "./user.route";
import { router as restaurantRouter } from "./restaurant.route";
import { router as tableRouter } from "./table.route";
import { router as waiterRouter } from "./waiter.route";
import { router as kitchenRouter } from "./kitchen.route";
import { router as publicRouter } from "./public.route";
import { router as appRouter } from "./app.route";
import { router as authRouter } from "./auth.route";

const defaultRouters = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/restaurant",
    route: restaurantRouter,
  },
  {
    path: "/tables",
    route: tableRouter,
  },
  {
    path: "/waiters",
    route: waiterRouter,
  },
  {
    path: "/kitchen",
    route: kitchenRouter,
  },
  {
    path: "/app",
    route: appRouter,
  },
  {
    path: "/",
    route: publicRouter,
  },
];

export const router = express.Router();

defaultRouters.forEach((route) => {
  router.use(route.path, route.route);
});

router.get("/getUploadUrl", auth(), getS3Url);