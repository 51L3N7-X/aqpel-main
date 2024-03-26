import { faker } from "@faker-js/faker";
import { setupDB } from "../../utils/setupDB";
import { beforeAll, describe, expect, test } from "@jest/globals";
import {
  insertCategories,
  insertItems,
  insertMenu,
  tempCategory,
  tempItem,
  tempMenu,
  tempRestaurant,
} from "../../fixtures/restaurant.fixture";
import request from "supertest";
import { app } from "../../../api/config/express_config";
import {
  tempUser2AccessToken,
  tempUserAccessToken,
} from "../../fixtures/token.fixture";
import httpStatus from "http-status";
import { Menu } from "../../../api/models/menu";
import { insertUsers, tempUser2 } from "../../fixtures/auth.fixture";
import mongoose from "mongoose";
import { Category } from "../../../api/models/category";

setupDB();

describe("Items Routes", () => {
  describe("POST /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId/item", () => {
    let newItem: {
      name: string;
      description: string;
      price: string;
    };

    beforeAll(() => {
      newItem = {
        name: faker.person.firstName(),
        description: faker.person.firstName(),
        price: faker.finance.amount(),
      };
    });
    test("should return 201 and successfully create an item if data is ok", async () => {
      await insertCategories([tempCategory]);
      const res = await request(app)
        .post(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempCategory._id}/item`
        )
        .set({ authorization: tempUserAccessToken })
        .send(newItem)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: newItem.name,
          description: newItem.description,
          id: expect.anything(),
        })
      );

      const category = await Category.findById(tempCategory._id);
      expect(category?.items[0].toString()).toEqual(res.body.id);
    });

    test("should return 404 error if token is invalid", async () => {
      await insertMenu([tempMenu]);
      await insertUsers([tempUser2]);

      await request(app)
        .post(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempCategory._id}/item`
        )
        .set("Authorization", tempUser2AccessToken)
        .send(newItem)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("GET /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId/item", () => {
    test("should return 200 and items array if data is ok", async () => {
      await insertItems([tempItem]);

      const res = await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempCategory._id}/item`
        )
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: tempItem.name,
            id: tempItem._id.toString(),
          }),
        ])
      );
    });

    test("should return 404 if user trying to get other user items", async () => {
      await insertItems([tempItem]);
      await insertUsers([tempUser2]);

      await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempItem._id}/item`
        )
        .set({ authorization: tempUser2AccessToken })
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 400 error if categoryId is invalid", async () => {
      await insertItems([tempItem]);

      await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/invalidId/item`
        )
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("GET /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId/item/:itemId", () => {
    test("should return 200 and item object if data is ok ", async () => {
      await insertItems([tempItem]);

      const res = await request(app)
        .get(
          `/v1/restaurant/${tempCategory._id}/menu/${tempMenu._id}/category/${tempCategory._id}/item/${tempItem._id}`
        )
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: tempItem.name,
          id: tempItem._id.toString(),
        })
      );
    });

    test("should return 400 error if restaurantId is invalid", async () => {
      await insertItems([tempItem]);

      await request(app)
        .get(
          `/v1/restaurant/invalidId/menu/${tempMenu._id}/category/${tempCategory._id}/item/${tempItem._id}`
        )
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if menuId is invalid", async () => {
      await insertItems([tempItem]);

      await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/invalidId/category/${tempCategory._id}/item/${tempItem._id}`
        )
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if categoryId is invalid", async () => {
      await insertItems([tempItem]);

      await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/invalidId/item/${tempItem._id}`
        )
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if access token is other user token", async () => {
      await insertItems([tempItem]);
      await insertUsers([tempUser2]);

      await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempCategory._id}/item/${tempItem._id}`
        )
        .set({ authorization: tempUser2AccessToken })
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 401 error if access token is missing", async () => {
      await insertItems([tempItem]);

      await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempCategory._id}/item/${tempItem._id}`
        )
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe("PATCH /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId/item/:itemId", () => {
    test("should return 200 and successfully update the item if data is ok", async () => {
      await insertItems([tempItem]);

      const res = await request(app)
        .patch(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempCategory._id}/item/${tempItem._id}`
        )
        .set({ authorization: tempUserAccessToken })
        .send({ name: "testName" })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: "testName",
          id: tempItem._id.toString(),
        })
      );
    });

    test("should return 404 error if item is not found", async () => {
      await insertCategories([tempCategory]);

      await request(app)
        .patch(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${
            tempCategory._id
          }/item/${new mongoose.Types.ObjectId()}`
        )
        .set({ authorization: tempUserAccessToken })
        .send({ name: "testName" })
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
