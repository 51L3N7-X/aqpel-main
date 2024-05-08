import { beforeEach, describe, expect, test } from "@jest/globals";
import { setupDB } from "../../utils/setupDB";
import request from "supertest";
import { app } from "../../../api/config/express_config";
import httpStatus from "http-status";
import { insertUsers, tempUser, tempUser2 } from "../../fixtures/auth.fixture";
import {
  tempUser2AccessToken,
  tempUserAccessToken,
} from "../../fixtures/token.fixture";
import { faker } from "@faker-js/faker";
import {
  insertRestaurants,
  tempRestaurant,
} from "../../fixtures/restaurant.fixture";
import { insertWaiter, tempWaiter } from "../../fixtures/waiter.fixture";
import mongoose from "mongoose";

setupDB();

describe("Waiter Routes", () => {
  describe("POST /v1/waiter/", () => {
    let newWaiter = {
      username: "testusername",
      password: "password123$",
      restaurantId: tempRestaurant._id.toString(),
    };

    beforeEach(() => {
      newWaiter = {
        ...newWaiter,
        username: faker.person.firstName().toLowerCase(),
      };
    });

    test("it should return 201 and successfully create a waiter if the data is ok", async () => {
      await insertRestaurants([tempRestaurant]);
      const res = await request(app)
        .post(`/v1/waiter`)
        .set({ authorization: tempUserAccessToken })
        .send(newWaiter)
        .expect(httpStatus.CREATED);

      expect(res.body).toMatchObject(
        expect.objectContaining({
          username: newWaiter.username,
          password: newWaiter.password,
          id: expect.anything(),
          restaurantId: newWaiter.restaurantId,
        })
      );
    });

    test("it should return 400 error if username is already exist", async () => {
      await insertRestaurants([tempRestaurant]);
      await insertWaiter([tempWaiter]);

      newWaiter.username = tempWaiter.username;

      const res = await request(app)
        .post("/v1/waiter")
        .set({ authorization: tempUserAccessToken })
        .send(newWaiter)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("it should return 400 error if restaurant not found", async () => {
      await insertUsers([tempUser]);

      const res = await request(app)
        .post("/v1/waiter")
        .set({ authorization: tempUserAccessToken })
        .send(newWaiter)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password is less than 8 characters", async () => {
      await insertRestaurants([tempRestaurant]);

      newWaiter.password = "pass1";

      const res = await request(app)
        .post("/v1/waiter")
        .set({ authorization: tempUserAccessToken })
        .send(newWaiter)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "password",
            message: expect.anything(),
          }),
        ])
      );
    });

    test("should return 400 error if password dose not contain both letters and numbers", async () => {
      await insertRestaurants([tempRestaurant]);

      newWaiter.password = "1111111";

      const res = await request(app)
        .post("/v1/waiter")
        .set({ authorization: tempUserAccessToken })
        .send(newWaiter)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "password",
            message: expect.anything(),
          }),
        ])
      );
    });

    test("should return 400 error if username is less than 3 characters", async () => {
      await insertRestaurants([tempRestaurant]);

      newWaiter.username = "js";

      const res = await request(app)
        .post("/v1/waiter")
        .set({ authorization: tempUserAccessToken })
        .send(newWaiter)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "username",
            message: expect.anything(),
          }),
        ])
      );
    });

    test("should return 400 error if one item of array items is invalid mongo id", async () => {
      await insertRestaurants([tempRestaurant]);

      //@ts-ignore
      newWaiter.tables = ["123"];

      const res = await request(app)
        .post("/v1/waiter")
        .set({ authorization: tempUserAccessToken })
        .send(newWaiter)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 0,
            message: expect.anything(),
          }),
        ])
      );
    });
  });

  describe("GET /v1/waiter/", () => {
    test("should return 200 and waiters array if access token is correct", async () => {
      await insertUsers([tempUser]);
      await insertWaiter([tempWaiter]);

      const res = await request(app)
        .get(`/v1/waiter`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.OK);
    });

    test("should return 401 error if access token is missed", async () => {
      await insertWaiter([tempWaiter]);

      await request(app)
        .get(`/v1/waiter`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /v1/waiter/:waiterId", () => {
    test("it should return 200 and waiter object if data is ok", async () => {
      await insertUsers([tempUser]);
      await insertWaiter([tempWaiter]);

      await request(app)
        .get(`/v1/waiter/${tempWaiter._id}`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.OK);
    });

    test("it should return 401 error if user trying to get other user waiter", async () => {
      await insertUsers([tempUser, tempUser2]);
      await insertWaiter([tempWaiter]);

      await request(app)
        .get(`/v1/waiter/${tempWaiter._id}`)
        .set({ authorization: tempUser2AccessToken })
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test("it should return 401 error if waiterId is invalid mongo id", async () => {
      await insertUsers([tempUser]);
      await insertWaiter([tempWaiter]);

      await request(app)
        .get(`/v1/waiter/invalidId`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("it should return 404 error if table is not found", async () => {
      await insertUsers([tempUser]);
      await insertWaiter([tempWaiter]);

      await request(app)
        .get(`/v1/waiter/${new mongoose.Types.ObjectId()}`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("PATCH /v1/waiter/:waiterId", () => {
    test("should return 200 and successfully update the floor if data is ok", async () => {
      await insertRestaurants([tempRestaurant]);
      await insertWaiter([tempWaiter]);

      const updateBody = {
        username: "testusername123$xx",
        restaurantId: tempRestaurant._id.toString(),
      };

      const res = await request(app)
        .patch(`/v1/waiter/${tempWaiter._id}`)
        .set({ authorization: tempUserAccessToken })
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject(
        expect.objectContaining({
          username: updateBody.username,
          userId: tempUser._id.toString(),
          id: tempWaiter._id.toString(),
        })
      );
    });
  });

  // describe("GET /v1/floor/:floorId/table", () => {
  //   test("should return 200 and tables array if the access token is correct", async () => {
  //     await insertTheTable();

  //     await request(app)
  //       .get(`/v1/floor/${tempFloor._id}/table`)
  //       .set({ authorization: tempUserAccessToken })
  //       .send()
  //       .expect(httpStatus.OK);
  //   });

  //   test("should return 401 error if access token is missed", async () => {
  //     await insertTheTable();

  //     await request(app)
  //       .get(`/v1/floor/${tempFloor._id}/table`)
  //       .send()
  //       .expect(httpStatus.UNAUTHORIZED);
  //   });
  // });

  // describe("GET /v1/floor/:floorId/table/:tableId", () => {
  //   test("should return 200 and the table object if data is ok", async () => {
  //     await insertTheTable();

  //     const res = await request(app)
  //       .get(`/v1/floor/${tempFloor._id}/table/${tempTable._id}`)
  //       .set({ authorization: tempUserAccessToken })
  //       .send()
  //       .expect(httpStatus.OK);

  //     expect(res.body).toMatchObject({
  //       number: String(tempTable.number),
  //       id: tempTable._id.toString(),
  //     });
  //   });

  //   test("should return 404 error if user trying to get another user table", async () => {
  //     await insertUsers([tempUser, tempUser2]);
  //     await Table.insertMany([tempTable]);

  //     const res = await request(app)
  //       .get(`/v1/floor/${tempFloor._id}/table/${tempTable._id}`)
  //       .set({ authorization: tempUser2AccessToken })
  //       .send()
  //       .expect(httpStatus.NOT_FOUND);
  //   });

  //   test("should return 400 error if tableId is invalid mongo id", async () => {
  //     await insertTheTable();

  //     await request(app)
  //       .get(`/v1/floor/${tempFloor._id}/table/invalidId`)
  //       .set({ authorization: tempUserAccessToken })
  //       .send()
  //       .expect(httpStatus.BAD_REQUEST);
  //   });

  //   test("should return 404 error if the table is not found", async () => {
  //     await insertTheTable();

  //     await request(app)
  //       .get(
  //         `/v1/floor/${tempFloor._id}/table/${new mongoose.Types.ObjectId()}`
  //       )
  //       .set({ authorization: tempUserAccessToken })
  //       .send()
  //       .expect(httpStatus.NOT_FOUND);
  //   });
  // });

  // describe("PATCH /v1/floor/:floorId/table/:tableId", () => {
  //   test("should return 200 and successfully update the floor if data is ok", async () => {
  //     await insertTheTable();

  //     const updateBody = {
  //       number: 69,
  //     };

  //     const res = await request(app)
  //       .patch(`/v1/floor/${tempFloor._id}/table/${tempTable._id}`)
  //       .set({ authorization: tempUserAccessToken })
  //       .send(updateBody)
  //       .expect(httpStatus.OK);

  //     expect(res.body).toMatchObject(
  //       expect.objectContaining({
  //         number: String(updateBody.number),
  //         userId: tempUser._id.toString(),
  //         floorId: tempFloor._id.toString(),
  //         id: tempTable._id.toString(),
  //       })
  //     );
  //   });
  // });
});
