import { objectId, password } from "./utils/custom";

import Joi from "joi";
// import JoiPhone from "joi-phone-number";

// const test = Joi.extend(JoiPhone);

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

//register
export const registerValidate = {
  body: Joi.object().keys({
    username: Joi.string().required().min(3).max(20),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    // phone: test.string().phoneNumber({ format: "e164" }).required(),
  }),
};

//login
export const loginValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

//logout
export const logoutValidate = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

//refresh
export const refreshTokenValidate = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

//menu
export const menuCreateValidate = {
  body: Joi.object().keys({
    name: Joi.string().min(1).required().max(20),
    categories: Joi.forbidden(),
    imageUrl: Joi.string(),
  }),
  params: Joi.object()
    .keys({
      restaurantId: Joi.required().custom(objectId),
    })
    .required(),
};

export const menuGetValidate = {
  params: Joi.object().keys({
    restaurantId: Joi.required().custom(objectId),
    menuId: Joi.required().custom(objectId),
  }),
};

export const menuModifyValidate = {
  body: Joi.object().keys({
    name: Joi.string().min(1),
    categories: Joi.forbidden(),
    imageUrl: Joi.string(),
  }),
  params: menuGetValidate.params,
};

export const menuDeleteValidate = {
  params: menuGetValidate.params,
};

//restaurant
export const restaurantCreateValidate = {
  body: Joi.object().keys({
    name: Joi.string().required().max(20).min(1),
    currency: Joi.string(),
    description: Joi.string(),
    menus: Joi.forbidden(),
    imageUrl: Joi.string(),
  }),
};

export const restaurantUpdateValidate = {
  params: Joi.object().keys({
    restaurantId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().max(20).min(1),
    currency: Joi.string(),
    description: Joi.string(),
    menus: Joi.forbidden(),
    imageUrl: Joi.string(),
  }),
};

export const restaurantGetOrDeleteValidate = {
  params: restaurantUpdateValidate.params,
};

//category
export const categoryCreateValidate = {
  params: Joi.object().keys({
    restaurantId: Joi.required().custom(objectId),
    menuId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().max(20).min(1),
    description: Joi.string().max(500),
    items: Joi.forbidden(),
    imageUrl: Joi.string(),
  }),
};

export const categoryGetValidate = {
  params: Joi.object().keys({
    restaurantId: Joi.required().custom(objectId),
    menuId: Joi.required().custom(objectId),
    categoryId: Joi.required().custom(objectId),
  }),
};

export const categoryModifyValidate = {
  params: categoryGetValidate.params,
  body: Joi.object().keys({
    name: Joi.string().max(20),
    description: Joi.object().max(500),
    items: Joi.forbidden(),
  }),
};

export const categoryDeleteValidate = {
  params: categoryGetValidate.params,
};

//item
export const itemCreateValidate = {
  params: Joi.object().keys({
    restaurantId: Joi.required().custom(objectId),
    menuId: Joi.required().custom(objectId),
    categoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(20),
    price: Joi.string().required(),
    description: Joi.string().max(500).optional().allow(""),
    calories: Joi.string().max(5).optional().allow(""),
    people: Joi.string().max(3).optional().allow(""),
    imageUrl: Joi.string(),
    new: Joi.boolean(),
    special: Joi.boolean(),
  }),
};

export const itemGetValidate = {
  params: Joi.object().keys({
    restaurantId: Joi.required().custom(objectId),
    menuId: Joi.required().custom(objectId),
    categoryId: Joi.required().custom(objectId),
    itemId: Joi.required().custom(objectId),
  }),
};

export const itemModifyValidate = {
  params: Joi.object().keys({
    restaurantId: Joi.required().custom(objectId),
    menuId: Joi.required().custom(objectId),
    categoryId: Joi.required().custom(objectId),
    itemId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(3).max(20),
    price: Joi.string(),
    description: Joi.string().max(500),
    calories: Joi.string().max(5),
    imageUrl: Joi.string(),
    new: Joi.boolean(),
    special: Joi.boolean(),
  }),
};
