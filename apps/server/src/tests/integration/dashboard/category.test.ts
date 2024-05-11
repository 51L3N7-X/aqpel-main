import { faker } from "@faker-js/faker";
import { setupDB } from "../../utils/setupDB";
import { beforeAll, describe, expect, test } from "@jest/globals";
import {
  insertCategories,
  insertMenu,
  tempCategory,
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

setupDB();

describe("Category Routes", () => {
  describe("POST /v1/restaurant/:restaurantId/menu/:menuId/category", () => {
    let newCategory: {
      name: string;
      description: string;
    };

    beforeAll(() => {
      newCategory = {
        name: faker.person.firstName(),
        description: faker.person.firstName(),
      };
    });
    test("should return 201 and successfully create a category if data is ok", async () => {
      await insertMenu([tempMenu]);
      const res = await request(app)
        .post(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category`
        )
        .set({ authorization: tempUserAccessToken })
        .send(newCategory)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: newCategory.name,
          description: newCategory.description,
          id: expect.anything(),
        })
      );

      const menu = await Menu.findById(tempMenu._id);
      expect(menu?.categories[0].toString()).toEqual(res.body.id);
    });

    test("should return 400 error if items field is inserted", async () => {
      await insertMenu([tempMenu]);

      await request(app)
        .post(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category`
        )
        .set("Authorization", tempUserAccessToken)
        .send({ ...newCategory, items: ["test"] })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if token is invalid", async () => {
      await insertMenu([tempMenu]);
      await insertUsers([tempUser2]);

      await request(app)
        .post(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category`
        )
        .set("Authorization", tempUser2AccessToken)
        .send(newCategory)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("GET /v1/restaurant/:restaurantId/menu/:menuId/category", () => {
    test("should return 200 and categories array if data is ok", async () => {
      await insertCategories([tempCategory]);

      const res = await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category`
        )
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: tempCategory.name,
            id: tempCategory._id.toString(),
          }),
        ])
      );
    });

    test("should return 404 if user trying to get other user categories", async () => {
      await insertCategories([tempCategory]);
      await insertUsers([tempUser2]);

      await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category`
        )
        .set({ authorization: tempUser2AccessToken })
        .expect(httpStatus.NOT_FOUND);
    });

    // test("should return 400 error if restaurantId is invalid", async () => {
    //   await insertCategories([tempCategory]);

    //   await request(app)
    //     .get(`/v1/restaurant/invalidId/menu/${tempMenu._id}/category`)
    //     .set({ authorization: tempUserAccessToken })
    //     .expect(httpStatus.BAD_REQUEST);
    // });

    test("should return 400 error if menuId is invalid", async () => {
      await insertCategories([tempCategory]);

      await request(app)
        .get(`/v1/restaurant/${tempRestaurant._id}/menu/invalidId/category`)
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("GET /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId", () => {
    test("should return 200 and category object if data is ok ", async () => {
      await insertCategories([tempCategory]);

      const res = await request(app)
        .get(
          `/v1/restaurant/${tempCategory._id}/menu/${tempMenu._id}/category/${tempCategory._id}`
        )
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: tempCategory.name,
          id: tempCategory._id.toString(),
        })
      );
    });

    test("should return 400 error if restaurantId is invalid", async () => {
      await insertCategories([tempCategory]);

      await request(app)
        .get(
          `/v1/restaurant/invalidId/menu/${tempMenu._id}/category/${tempCategory._id}`
        )
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if menuId is invalid", async () => {
      await insertCategories([tempCategory]);

      await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/invalidId/category/${tempCategory._id}`
        )
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if access token is other user token", async () => {
      await insertCategories([tempCategory]);
      await insertUsers([tempUser2]);

      await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempCategory._id}`
        )
        .set({ authorization: tempUser2AccessToken })
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 401 error if access token is missing", async () => {
      await insertCategories([tempCategory]);

      await request(app)
        .get(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempCategory._id}`
        )
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe("PATCH /v1/restaurant/:restaurantId/menu/:menuId/category/:categoryId", () => {
    test("should return 200 and successfully update category if data is ok", async () => {
      await insertCategories([tempCategory]);

      const res = await request(app)
        .patch(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempCategory._id}`
        )
        .set({ authorization: tempUserAccessToken })
        .send({ name: "testName" })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: "testName",
          id: tempCategory._id.toString(),
        })
      );
    });

    // test("should return 404 error if restaurant is not found", async () => {
    //   await insertCategories([tempCategory]);

    //   await request(app)
    //     .patch(
    //       `/v1/restaurant/${tempMenu._id}/menu/${tempMenu._id}/category/${tempCategory._id}`
    //     )
    //     .set({ authorization: tempUserAccessToken })
    //     .send({ name: "testName" })
    //     .expect(httpStatus.NOT_FOUND);
    // });

    test("should return 404 error if category is not found", async () => {
      await insertCategories([tempCategory]);

      await request(app)
        .patch(
          `/v1/restaurant/${tempRestaurant._id}/menu/${
            tempMenu._id
          }/category/${new mongoose.Types.ObjectId()}`
        )
        .set({ authorization: tempUserAccessToken })
        .send({ name: "testName" })
        .expect(httpStatus.NOT_FOUND);
    });

    // test("should return 404 error if menu is not found", async () => {
    //   await insertCategories([tempCategory]);

    //   await request(app)
    //     .patch(
    //       `/v1/restaurant/${
    //         tempRestaurant._id
    //       }/menu/${new mongoose.Types.ObjectId()}/category/${tempCategory._id}`
    //     )
    //     .set({ authorization: tempUserAccessToken })
    //     .send({ name: "testName" })
    //     .expect(httpStatus.NOT_FOUND);
    // });

    test("should return 400 error if items field is inserted", async () => {
      await insertMenu([tempMenu]);

      await request(app)
        .patch(
          `/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}/category/${tempCategory._id}`
        )
        .set({ authorization: tempUserAccessToken })
        .send({ items: ["test"] })
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
