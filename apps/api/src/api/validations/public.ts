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
    price: Joi.number().required().max(999),
    description: Joi.string().max(500).optional().allow(""),
    calories: Joi.number().max(99999).optional().allow(""),
    people: Joi.number().max(10).optional().allow(""),
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
    price: Joi.number().max(999),
    description: Joi.string().max(500),
    calories: Joi.number().max(99),
    imageUrl: Joi.string(),
    new: Joi.boolean(),
    people: Joi.number().max(99),
    special: Joi.boolean(),
  }),
};

export const floorCreateValidate = {
  body: Joi.object().keys({
    number: Joi.number().required().max(99).min(0),
    tables: Joi.forbidden(),
  }),
};

export const floorModifyValidate = {
  params: Joi.object().keys({
    floorId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    number: Joi.number().max(99).min(1),
    tables: Joi.forbidden(),
  }),
};

export const floorGetValidate = {
  params: Joi.object().keys({
    floorId: Joi.custom(objectId).required(),
  }),
};

export const floorDeleteValidate = {
  params: Joi.object().keys({
    floorId: Joi.custom(objectId).required(),
  }),
};

export interface Table {
  number: string;
  chairs: string;
  shape: "square" | "circle";
  restaurantId: string;
  restaurant_name: string;
  userId: string;
  floorId: string;
}

export const tableCreateValidate = {
  body: Joi.object().keys({
    number: Joi.number().min(1).max(99).required(),
    chairs: Joi.number().min(1).max(8).default(2),
    shape: Joi.string().valid("square", "circle").default("square"),
    restaurantId: Joi.string().custom(objectId).required(),
    restaurant_name: Joi.string(),
  }),
  params: Joi.object().keys({
    floorId: Joi.custom(objectId).required(),
  }),
};

export const tableModifyValidate = {
  body: Joi.object().keys({
    number: Joi.number().min(1).max(100),
    shape: Joi.string().valid("square", "circle"),
    chairs: Joi.number().min(1).max(8),
    restaurantId: Joi.string().custom(objectId),
    restaurant_name: Joi.string(),
  }),
  params: Joi.object().keys({
    floorId: Joi.custom(objectId).required(),
    tableId: Joi.custom(objectId).required(),
  }),
};

export const tableGetValidate = {
  params: Joi.object().keys({
    floorId: Joi.custom(objectId).required(),
    tableId: Joi.custom(objectId).required(),
  }),
};

export const tableDeleteValidate = {
  params: Joi.object().keys({
    floorId: Joi.custom(objectId).required(),
    tableId: Joi.custom(objectId).required(),
  }),
};
