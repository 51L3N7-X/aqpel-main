import { beforeEach, describe, expect, test } from "@jest/globals";
import { setupDB } from "../../utils/setupDB";
import { faker } from "@faker-js/faker";
import request from "supertest";
import { app } from "../../../api/config/express_config";
import httpStatus from "http-status";
import {
  insertRestaurants,
  tempRestaurant,
} from "../../fixtures/restaurant.fixture";
import { insertUsers, tempUser, tempUser2 } from "../../fixtures/auth.fixture";
import {
  tempUser2AccessToken,
  tempUserAccessToken,
} from "../../fixtures/token.fixture";

setupDB();

describe("Restaurant routes", () => {
  describe("POST /v1/restaurant", () => {
    let newRestaurant: {
      name: string;
      description: string;
    };

    beforeEach(() => {
      newRestaurant = {
        name: faker.person.firstName().toLocaleLowerCase(),
        description: faker.lorem.paragraph(),
      };
    });

    test("should return 201 and successfully create restaurant if data is ok", async () => {
      await insertUsers([tempUser]);
      let res = await request(app)
        .post("/v1/restaurant")
        .set("Authorization", tempUserAccessToken)
        .send(newRestaurant)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        name: newRestaurant.name,
        description: newRestaurant.description,
        id: expect.anything(),
        userId: tempUser._id.toString(),
      });
    });

    test("should return 400 error if the name is duplicated for same user", async () => {
      await insertRestaurants([tempRestaurant]);

      await request(app)
        .post("/v1/restaurant")
        .set("Authorization", tempUserAccessToken)
        .send({ ...newRestaurant, name: tempRestaurant.name })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("GET /v1/restaurant", () => {
    test("should return 200 and the restaurants array if access token is correct", async () => {
      insertRestaurants([tempRestaurant]);

      await request(app)
        .get(`/v1/restaurant`)
        .set({
          Authorization: tempUserAccessToken,
        })
        .send()
        .expect(httpStatus.OK);
    });

    test("should return 401 error if access token is missing", async () => {
      await insertRestaurants([tempRestaurant]);

      await request(app)
        .get(`/v1/restaurant`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /v1/restaurant/:restaurantId", () => {
    test("should return 200 and the restaurant object if data is ok", async () => {
      await insertRestaurants([tempRestaurant]);

      const res = await request(app)
        .get(`/v1/restaurant/${tempRestaurant._id}`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        name: tempRestaurant.name,
        userId: tempRestaurant.userId.toString(),
        id: tempRestaurant._id.toString(),
      });
    });

    test("should return 404 error if user trying to get another user restaurant", async () => {
      await insertUsers([tempUser2]);
      await insertRestaurants([tempRestaurant]);

      await request(app)
        .get(`/v1/restaurant/${tempRestaurant._id}`)
        .set({ authorization: tempUser2AccessToken })
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 400 error if restaurantId is invalid mongo id", async () => {
      await insertRestaurants([tempRestaurant]);

      await request(app)
        .get("/v1/restaurant/invalidId")
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if restaurant is not found", async () => {
      await insertUsers([tempUser]);

      await request(app)
        .get(`/v1/restaurant/${tempRestaurant._id}`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("PATCH /v1/restaurant/:restaurantId", () => {
    test("should return 200 and successfully update restaurant if data is ok", async () => {
      insertRestaurants([tempRestaurant]);

      const updateBody = {
        name: "testName",
      };

      const res = await request(app)
        .patch(`/v1/restaurant/${tempRestaurant._id}`)
        .set({ authorization: tempUserAccessToken })
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        name: updateBody.name,
        userId: tempUser._id.toString(),
        id: tempRestaurant._id.toString(),
      });
    });

    test("should return 400 error if menus field is passed", async () => {
      insertRestaurants([tempRestaurant]);

      const updateBody = {
        menus: ["test"],
      };

      await request(app)
        .patch(`/v1/restaurant/${tempRestaurant._id}`)
        .set({ authorization: tempUserAccessToken })
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
