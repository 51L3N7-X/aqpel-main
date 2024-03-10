import { objectId, password, phone } from "./utils/custom";

import Joi from "joi";
import JoiPhone from "joi-phone-number";

const test = Joi.extend(JoiPhone);

export const orderValidate = {
  body: Joi.object().keys({
    type: Joi.string().required().valid("order", "waiter", "ember", "bill"),
    restaurant_id: Joi.string().required(),
    table_id: Joi.string().required().custom(objectId),
    // table_number: Joi.number().required(),
    order_details: Joi.object({
      price: Joi.string().required(),
    }).optional(),
  }),
};

export const registerValidate = {
  body: Joi.object().keys({
    username: Joi.string().required().min(3).max(15),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    // phone: test.string().phoneNumber({ format: "e164" }).required(),
  }),
};

export const loginValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

export const logoutValidate = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokenValidate = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
