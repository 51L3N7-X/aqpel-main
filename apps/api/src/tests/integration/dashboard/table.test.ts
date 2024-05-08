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
import { insertTheFloor, tempFloor } from "../../fixtures/floor.fixture";
import {
  insertRestaurants,
  tempRestaurant,
} from "../../fixtures/restaurant.fixture";
import { insertTheTable, tempTable } from "../../fixtures/table.fixture";
import mongoose from "mongoose";
import { Table } from "../../../api/models/table";

setupDB();

describe("Tables Routes", () => {
  describe("POST /v1/floor/:floorId/table", () => {
    let newTable = {
      number: 1,
      chairs: 4,
      shape: "square",
      restaurantId: tempRestaurant._id.toString(),
    };

    beforeEach(() => {
      newTable = {
        ...newTable,
        number: Math.floor(Math.random() * 9) + 2,
      };
    });

    test("it should return 201 and successfully create a table if the data is ok", async () => {
      await insertRestaurants([tempRestaurant]);
      await insertTheFloor();
      const res = await request(app)
        .post(`/v1/floor/${tempFloor._id}/table`)
        .set({ authorization: tempUserAccessToken })
        .send(newTable)
        .expect(httpStatus.CREATED);

      expect(res.body).toMatchObject(
        expect.objectContaining({
          number: String(newTable.number),
          id: expect.anything(),
          chairs: String(newTable.chairs),
          shape: "square",
        })
      );
    });

    test("it should return 400 if the table number is existed already", async () => {
      await insertTheTable();

      newTable.number = tempTable.number;
      await request(app)
        .post(`/v1/floor/${tempFloor._id}/table`)
        .set({ authorization: tempUserAccessToken })
        .send(newTable)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("it should return 400 if the table number is larger than 99", async () => {
      await insertRestaurants([tempRestaurant]);
      await insertTheFloor();

      newTable.number = 100;
      await request(app)
        .post(`/v1/floor/${tempFloor._id}/table`)
        .set({ authorization: tempUserAccessToken })
        .send(newTable)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("GET /v1/floor/:floorId/table", () => {
    test("should return 200 and tables array if the access token is correct", async () => {
      await insertTheTable();

      await request(app)
        .get(`/v1/floor/${tempFloor._id}/table`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.OK);
    });

    test("should return 401 error if access token is missed", async () => {
      await insertTheTable();

      await request(app)
        .get(`/v1/floor/${tempFloor._id}/table`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /v1/floor/:floorId/table/:tableId", () => {
    test("should return 200 and the table object if data is ok", async () => {
      await insertTheTable();

      const res = await request(app)
        .get(`/v1/floor/${tempFloor._id}/table/${tempTable._id}`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        number: String(tempTable.number),
        id: tempTable._id.toString(),
      });
    });

    test("should return 404 error if user trying to get another user table", async () => {
      await insertUsers([tempUser, tempUser2]);
      await Table.insertMany([tempTable]);

      const res = await request(app)
        .get(`/v1/floor/${tempFloor._id}/table/${tempTable._id}`)
        .set({ authorization: tempUser2AccessToken })
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 400 error if tableId is invalid mongo id", async () => {
      await insertTheTable();

      await request(app)
        .get(`/v1/floor/${tempFloor._id}/table/invalidId`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if the table is not found", async () => {
      await insertTheTable();

      await request(app)
        .get(
          `/v1/floor/${tempFloor._id}/table/${new mongoose.Types.ObjectId()}`
        )
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("PATCH /v1/floor/:floorId/table/:tableId", () => {
    test("should return 200 and successfully update the table if data is ok", async () => {
      // await insertRestaurants([tempRestaurant]);
      await insertTheTable();

      const updateBody = {
        number: 69,
        restaurantId: tempRestaurant._id.toString(),
      };

      const res = await request(app)
        .patch(`/v1/floor/${tempFloor._id}/table/${tempTable._id}`)
        .set({ authorization: tempUserAccessToken })
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject(
        expect.objectContaining({
          number: String(updateBody.number),
          userId: tempUser._id.toString(),
          floorId: tempFloor._id.toString(),
          id: tempTable._id.toString(),
        })
      );
    });
  });
});
