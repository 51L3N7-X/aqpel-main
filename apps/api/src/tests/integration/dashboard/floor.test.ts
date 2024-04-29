import { beforeEach, describe, expect, test } from "@jest/globals";
import { setupDB } from "../../utils/setupDB";
import { faker } from "@faker-js/faker";
import request from "supertest";
import { app } from "../../../api/config/express_config";
import httpStatus from "http-status";
import { insertUsers, tempUser, tempUser2 } from "../../fixtures/auth.fixture";
import {
  tempUser2AccessToken,
  tempUserAccessToken,
} from "../../fixtures/token.fixture";
import { insertTheFloor, tempFloor } from "../../fixtures/floor.fixture";
import mongoose from "mongoose";

setupDB();

describe("Floor Routes", () => {
  describe("POST /v1/floor", () => {
    let newFloor = {
      number: 0,
    };

    beforeEach(() => {
      newFloor = {
        number: Math.floor(Math.random() * 9) + 2,
      };
    });

    test("it should return 201 and successfully create a floor is the data is ok", async () => {
      await insertUsers([tempUser]);
      const res = await request(app)
        .post("/v1/floor")
        .set({ authorization: tempUserAccessToken })
        .send(newFloor)
        .expect(httpStatus.CREATED);

      expect(res.body).toMatchObject(
        expect.objectContaining({
          number: String(newFloor.number),
          id: expect.anything(),
        })
      );
    });

    test("it should return 400 if the floor number is existed already", async () => {
      await insertUsers([tempUser]);
      await insertTheFloor();

      newFloor.number = tempFloor.number;
      await request(app)
        .post("/v1/floor")
        .set({ authorization: tempUserAccessToken })
        .send(newFloor)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("it should return 400 if the floor number is larger than 99", async () => {
      await insertUsers([tempUser]);
      await insertTheFloor();

      newFloor.number = 100;
      await request(app)
        .post("/v1/floor")
        .set({ authorization: tempUserAccessToken })
        .send(newFloor)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("GET /v1/floor", () => {
    test("should return 200 and floors array if the access token is correct", async () => {
      await insertTheFloor();
      await insertUsers([tempUser]);

      await request(app)
        .get("/v1/floor")
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.OK);
    });

    test("should return 401 error if access token is missed", async () => {
      await insertTheFloor();
      await insertUsers([tempUser]);

      await request(app)
        .get("/v1/floor")
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /v1/floor/:floorId", () => {
    test("should return 200 and the floor object if data is ok", async () => {
      await insertUsers([tempUser]);
      await insertTheFloor();

      const res = await request(app)
        .get(`/v1/floor/${tempFloor._id}`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        number: String(tempFloor.number),
        id: tempFloor._id.toString(),
      });
    });

    test("should return 404 error if user trying to get another user floor", async () => {
      await insertUsers([tempUser, tempUser2]);
      await insertTheFloor();

      const res = await request(app)
        .get(`/v1/floor/${tempFloor._id}`)
        .set({ authorization: tempUser2AccessToken })
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 400 error if floorId is invalid mongo id", async () => {
      await insertTheFloor();
      await insertUsers([tempUser]);

      await request(app)
        .get("/v1/floor/invalidId")
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if floor is not found", async () => {
      await insertTheFloor();
      await insertUsers([tempUser]);

      const res = await request(app)
        .get(`/v1/floor/${new mongoose.Types.ObjectId()}`)
        .set({ authorization: tempUserAccessToken })
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("PATCH /v1/floor/:floorId", () => {
    test("should return 200 and successfully update the floor if data is ok", async () => {
      await insertTheFloor();
      await insertUsers([tempUser]);

      const updateBody = {
        number: 69,
      };

      const res = await request(app)
        .patch(`/v1/floor/${tempFloor._id}`)
        .set({ authorization: tempUserAccessToken })
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        number: String(updateBody.number),
        userId: tempUser._id.toString(),
        id: tempFloor._id.toString(),
      });
    });

    test("should return 400 error if tables field is passed", async () => {
      await insertTheFloor();
      await insertUsers([tempUser]);

      const updateBody = {
        tables: ["test"],
      };

      await request(app)
        .patch(`/v1/restaurant/${tempFloor._id}`)
        .set({ authorization: tempUserAccessToken })
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
