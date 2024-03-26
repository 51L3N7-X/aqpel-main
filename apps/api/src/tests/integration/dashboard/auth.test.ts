import { beforeEach, describe, expect, test } from "@jest/globals";
import { setupDB } from "../../utils/setupDB";
import { faker } from "@faker-js/faker";
import request from "supertest";
import { app } from "../../../api/config/express_config";
import httpStatus from "http-status";
import { User } from "../../../api/models/user";
import { insertUsers, tempUser } from "../../fixtures/auth.fixture";
import moment from "moment";
import { config } from "../../../api/config/config";
import { generateToken } from "../../../api/services/token.service";
import { tokenTypes } from "../../../api/constants/tokens";
import { tokenService } from "../../../api/services";
import { Token } from "../../../api/models/token";

setupDB();

describe("Auth routes", () => {
  describe("POST /v1/auth/register", () => {
    let newUser: {
      username: string;
      email: string;
      password: string;
    };
    beforeEach(() => {
      newUser = {
        username: faker.person.firstName().toLowerCase(),
        email: faker.internet.email().toLowerCase(),
        password: "password1",
      };
    });

    test("should return 201 and successfully register user if request data is ok", async () => {
      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.CREATED);

      expect(res.body).toHaveProperty("user");
      expect(res.body.success).toBe(true);
      expect(res.body.user).not.toHaveProperty("password");

      expect(res.body.user).toEqual({
        username: newUser.username,
        email: newUser.email,
        id: expect.anything(),
        plan: "free",
        verified: false,
      });

      const dbUser = await User.findById(res.body.user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser?.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        username: newUser.username,
        email: newUser.email,
        plan: "free",
        verified: false,
      });

      expect(res.body.tokens).toEqual({
        access: {
          token: expect.anything(),
          expires: expect.anything(),
        },
        refresh: {
          token: expect.anything(),
          expires: expect.anything(),
        },
      });
    });

    test("should return 400 error if email is invalid", async () => {
      newUser.email = "shit";

      await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 409 error if email is already used", async () => {
      insertUsers([tempUser]);

      newUser.email = tempUser.email;
      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.CONFLICT);

      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "email",
            message: expect.anything(),
          }),
        ])
      );
    });

    test("should return 409 error if username is already used", async () => {
      insertUsers([tempUser]);

      newUser.username = tempUser.username;

      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.CONFLICT);

      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "username",
            message: expect.anything(),
          }),
        ])
      );
    });

    test("should return 409 error if both username and email is already used", async () => {
      insertUsers([tempUser]);

      newUser.username = tempUser.username;
      newUser.email = tempUser.email;

      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.CONFLICT);

      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "username",
            message: expect.anything(),
          }),
          expect.objectContaining({
            type: "email",
            message: expect.anything(),
          }),
        ])
      );
    });

    test("should return 400 error if password is less than 8 characters", async () => {
      insertUsers([tempUser]);

      newUser.password = "pass1";

      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
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
      insertUsers([tempUser]);

      newUser.password = "1111111";

      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
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
  });

  describe("POST /v1/auth/login", () => {
    test("should return 200 and login user if username or email and password match", async () => {
      await insertUsers([tempUser]);

      const loginCredentials = {
        email: tempUser.email,
        password: tempUser.password,
      };

      const res = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);

      expect(res.body.user).toEqual({
        id: expect.anything(),
        username: tempUser.username,
        email: tempUser.email,
        verified: false,
        plan: "free",
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: {
          token: expect.anything(),
          expires: expect.anything(),
        },
      });
    });

    test("should return 400 error if one of username and email or password dose not entered", async () => {
      await insertUsers([tempUser]);

      const loginCredentials = {
        // userNameOrEmail: tempUser.email,
        // password: tempUser.password,
      };

      await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password is incorrect", async () => {
      await insertUsers([tempUser]);

      const loginCredentials = {
        userNameOrEmail: tempUser.email,
        password: "randomPassword12347@*&4823",
      };

      await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("POST /v1/auth/logout", () => {
    test("should return 204 if refresh token is valid", async () => {
      await insertUsers([tempUser]);
      const expires = moment().add(config.jwt.refreshExpirationDays, "days");
      const refreshToken = generateToken(
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH
      );

      await tokenService.saveToken(
        refreshToken,
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH
      );

      await request(app)
        .post("/v1/auth/logout")
        .send({ refreshToken })
        .expect(httpStatus.NO_CONTENT);

      const refreshTokenDoc = await Token.findOne({ token: refreshToken });
      expect(refreshTokenDoc).toBe(null);
    });

    test("should return 400 error if refresh token is missing from request body", async () => {
      await request(app)
        .post("/v1/auth/logout")
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if refresh token is not found in the database", async () => {
      await insertUsers([tempUser]);
      const expires = moment().add(config.jwt.refreshExpirationDays, "days");
      const refreshToken = tokenService.generateToken(
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH
      );

      await request(app)
        .post("/v1/auth/logout")
        .send({ refreshToken })
        .expect(httpStatus.NOT_FOUND);
    });

    test("should return 404 error if refresh token is blacklisted", async () => {
      await insertUsers([tempUser]);
      const expires = moment().add(config.jwt.refreshExpirationDays, "days");
      const refreshToken = tokenService.generateToken(
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH
      );

      await tokenService.saveToken(
        refreshToken,
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH,
        true
      );

      await request(app)
        .post("/v1/auth/logout")
        .send({ refreshToken })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("POST /v1/auth/refresh-tokens", () => {
    test("should return 200 and new auth tokens if refresh token is valid", async () => {
      await insertUsers([tempUser]);
      const expires = moment().add(config.jwt.refreshExpirationDays, "days");
      const refreshToken = tokenService.generateToken(
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH
      );
      await tokenService.saveToken(
        refreshToken,
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH
      );

      const res = await request(app)
        .post("/v1/auth/refresh-tokens")
        .send({ refreshToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });

      const refreshTokenDoc = await Token.findOne({
        token: res.body.refresh.token,
      });

      expect(refreshTokenDoc).toMatchObject({
        type: tokenTypes.REFRESH,
        userId: tempUser._id,
        blacklisted: false,
      });

      const TokensCount = await Token.countDocuments();
      expect(TokensCount).toBe(1);
    });

    test("should return 400 error if refresh token is missing from request body", async () => {
      await request(app)
        .post("/v1/auth/refresh-tokens")
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 401 error if refresh token is signed with invalid secret", async () => {
      await insertUsers([tempUser]);
      const expires = moment().add(config.jwt.refreshExpirationDays, "days");
      const refreshToken = tokenService.generateToken(
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH,
        "invalid secret"
      );

      await tokenService.saveToken(
        refreshToken,
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH
      );

      await request(app)
        .post("/v1/auth/refresh-tokens")
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 error if the token is not found in the database", async () => {
      await insertUsers([tempUser]);
      const expires = moment().add(config.jwt.refreshExpirationDays, "days");
      const refreshToken = tokenService.generateToken(
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH,
        config.jwt.secret
      );

      await request(app)
        .post("/v1/auth/refresh-tokens")
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 error if refresh token is blacklisted", async () => {
      await insertUsers([tempUser]);
      const expires = moment().add(config.jwt.refreshExpirationDays, "days");
      const refreshToken = tokenService.generateToken(
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH,
        config.jwt.secret
      );
      await tokenService.saveToken(
        refreshToken,
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH,
        true
      );

      await request(app)
        .post("/v1/auth/refresh-tokens")
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 error if refresh token is expired", async () => {
      await insertUsers([tempUser]);
      const expires = moment().subtract(1, "minute");
      const refreshToken = tokenService.generateToken(
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH,
        config.jwt.secret
      );
      await tokenService.saveToken(
        refreshToken,
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH
      );

      await request(app)
        .post("/v1/auth/refresh-tokens")
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 error if user is not found", async () => {
      const expires = moment().add(config.jwt.refreshExpirationDays, "days");
      const refreshToken = tokenService.generateToken(
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH,
        config.jwt.secret
      );
      await tokenService.saveToken(
        refreshToken,
        tempUser._id as any,
        expires,
        tokenTypes.REFRESH
      );

      await request(app)
        .post("/v1/auth/refresh-tokens")
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});
