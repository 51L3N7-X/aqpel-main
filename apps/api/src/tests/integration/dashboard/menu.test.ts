import { faker } from "@faker-js/faker";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import {
  insertMenu,
  insertRestaurants,
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
import { setupDB } from "../../utils/setupDB";
import { insertUsers, tempUser, tempUser2 } from "../../fixtures/auth.fixture";
import { Restaurant } from "../../../api/models/restaurant";
import mongoose from "mongoose";

setupDB();

jest.setTimeout(10000);

describe("Menu Routes", () => {
  describe("POST /v1/restaurant/:restaurantId/menu", () => {
    let newMenu: {
      name: string;
    };

    beforeEach(() => {
      newMenu = {
        name: faker.person.firstName(),
      };
    });

    test("should return 201 and successfully create a menu if data is ok", async () => {
      await insertRestaurants([tempRestaurant]);
      const res = await request(app)
        .post(`/v1/restaurant/${tempRestaurant._id}/menu`)
        .set({ authorization: tempUserAccessToken })
        .send(newMenu)
        .expect(httpStatus.CREATED);
      // console.log(res);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: newMenu.name,
          restaurantId: tempRestaurant._id.toString(),
        })
      );

      const restaurant = await Restaurant.findById(tempRestaurant._id);
      expect(restaurant?.menus[0].toString()).toEqual(res.body.id);
    });

    test("should return 400 error if the name is duplicated for same user", async () => {
      await insertMenu([tempMenu]);

      await request(app)
        .post(`/v1/restaurant/${tempRestaurant._id}/menu`)
        .set({ authorization: tempUserAccessToken })
        .send({ ...newMenu, name: tempMenu.name })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if categories field is inserted", async () => {
      await insertRestaurants([tempRestaurant]);

      await request(app)
        .post(`/v1/restaurant/${tempRestaurant._id}/menu`)
        .set("Authorization", tempUserAccessToken)
        .send({ ...newMenu, categories: ["test"] })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if token is invalid", async () => {
      await insertRestaurants([tempRestaurant]);
      await insertUsers([tempUser2]);

      await request(app)
        .post(`/v1/restaurant/${tempRestaurant._id}/menu`)
        .set("Authorization", tempUser2AccessToken)
        .send(newMenu)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("GET /v1/restaurant/:restaurantId/menu", () => {
    test("should return 200 and array menu if data is ok", async () => {
      await insertMenu([tempMenu]);

      const res = await request(app)
        .get(`/v1/restaurant/${tempRestaurant._id}/menu`)
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: tempMenu.name,
            id: tempMenu._id.toString(),
          }),
        ])
      );
    });

    test("should return 404 if user trying to get other user menus", async () => {
      await insertMenu([tempMenu]);
      await insertUsers([tempUser2]);

      await request(app)
        .get(`/v1/restaurant/${tempRestaurant._id}/menu`)
        .set({ authorization: tempUser2AccessToken })
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 400 error if restaurantId is invalid", async () => {
      await insertMenu([tempMenu]);

      await request(app)
        .get(`/v1/restaurant/invalidId/menu`)
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("GET /v1/restaurant/:restaurantId/menu/:menuId", () => {
    test("should return 200 and restaurant object if data is ok ", async () => {
      await insertMenu([tempMenu]);

      const res = await request(app)
        .get(`/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}`)
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: tempMenu.name,
          id: tempMenu._id.toString(),
        })
      );
    });

    test("should return 400 error if restaurantId is invalid", async () => {
      await insertMenu([tempMenu]);

      await request(app)
        .get(`/v1/restaurant/invalidId/menu/${tempMenu._id}`)
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if menuId is invalid", async () => {
      await insertMenu([tempMenu]);

      await request(app)
        .get(`/v1/restaurant/${tempRestaurant._id}/menu/invalidId`)
        .set({ authorization: tempUserAccessToken })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if access token is other user token", async () => {
      await insertMenu([tempMenu]);
      await insertUsers([tempUser2]);

      await request(app)
        .get(`/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}`)
        .set({ authorization: tempUser2AccessToken })
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 401 error if access token is missing", async () => {
      await insertMenu([tempMenu]);

      await request(app)
        .get(`/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}`)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe("PATCH /v1/restaurant/:restaurantId/menu/:menuId", () => {
    test("should return 200 and successfully update menu if data is ok", async () => {
      await insertMenu([tempMenu]);

      const res = await request(app)
        .patch(`/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}`)
        .set({ authorization: tempUserAccessToken })
        .send({ name: "testName" })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: "testName",
          id: tempMenu._id.toString(),
        })
      );
    });

    test("should return 404 error if restaurant is not found", async () => {
      await insertMenu([tempMenu]);

      await request(app)
        .patch(`/v1/restaurant/${tempMenu._id}/menu/${tempMenu._id}`)
        .set({ authorization: tempUserAccessToken })
        .send({ name: "testName" })
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 404 error if menu is not found", async () => {
      await insertMenu([tempMenu]);

      await request(app)
        .patch(
          `/v1/restaurant/${
            tempRestaurant._id
          }/menu/${new mongoose.Types.ObjectId()}`
        )
        .set({ authorization: tempUserAccessToken })
        .send({ name: "testName" })
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 400 error if categories field is inserted", async () => {
      await insertMenu([tempMenu]);

      await request(app)
        .patch(`/v1/restaurant/${tempRestaurant._id}/menu/${tempMenu._id}`)
        .set({ authorization: tempUserAccessToken })
        .send({ categories: ["test"] })
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
