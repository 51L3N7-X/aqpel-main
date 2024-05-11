import express from "express";

import { auth } from "../../middlewares/auth";

import { router as userRouter } from "./user.route";
import { router as restaurantRouter } from "./restaurant.route";
import { router as waiterRouter } from "./waiter.route";
import { router as kitchenRouter } from "./kitchen.route";
import { router as publicRouter } from "./public.route";
import { router as appRouter } from "./app.route";
import { router as authRouter } from "./auth.route";
import { router as floorRouter } from "./floor.route";

import { getUrl } from "../../controllers/dashboard/getS3Url";

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
    path: "/floor",
    route: floorRouter,
  },
  {
    path: "/waiter",
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

router.get("/getUploadURL", auth(), getUrl);

defaultRouters.forEach((route) => {
  router.use(route.path, route.route);
});
