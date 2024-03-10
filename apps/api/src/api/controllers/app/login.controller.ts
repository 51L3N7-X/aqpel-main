import { Kitchen } from "../../models/kitchen";
import { Restaurant } from "../../models/restaurant";
import { Waiter } from "../../models/waiter";
// import { genToken } from "../../utils/genToken";
import jwt from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";

export const login = catchAsync(async (req: Request, res: Response) => {
  const { restaurant_name, username, password, type } = req.body;
  if (type == "waiter") {
    const waiter = await Waiter.findOne({
      $or: [{ password }, { username }],
    })
      .select("-userId")
      .lean();
    if (
      !waiter ||
      restaurant_name != waiter.restaurant_name ||
      password != waiter.password
    )
      throw new Error(
        "The username or password you entered is incorrect. Please try again."
      );

    const token = jwt.sign(
      {
        id: waiter._id,
        username,
      },
      process.env.JWT_TOKEN_KEY!,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      }
    );
    return res.status(200).json({ ...waiter, token });
  } else if (type == "kitchen") {
    const kitchen = await Kitchen.findOne({
      $or: [{ username, password }],
    })
      .select("-userId")
      .lean();
    if (
      !kitchen ||
      restaurant_name != kitchen.restaurant_name ||
      password != kitchen.password
    )
      throw new Error(
        "The username or password you entered is incorrect. Please try again."
      );

    const token = jwt.sign(
      {
        id: kitchen._id,
        username,
      },
      process.env.JWT_TOKEN_KEY!,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      }
    );
    return res.status(200).json({ ...kitchen, token });
  } else {
    return res.status(500).json({
      message: "only kitchen or waiter types valid",
      success: false,
    });
  }
});
