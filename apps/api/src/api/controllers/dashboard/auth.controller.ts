import { catchAsync } from "../../utils/catchAsync";
import { RequestWithUser } from "../../../types/controllers";
import { ApiError, ErrorObject } from "../../utils/ApiError";
import { User } from "../../models/user";
import { Response } from "express";
import { NextFunction } from "express";
import httpStatus from "http-status";
import { generateAuthTokens } from "../../services/token.service";
import { authService, tokenService } from "../../services";

export const login = catchAsync(async (req: RequestWithUser, res: Response) => {
  if (req.headers.authorization) throw new ApiError(400, "Authenticated");
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push(new ErrorObject("email", "Content cannot be empty!"));
  if (!password)
    errors.push(new ErrorObject("password", "Content cannot be empty!"));

  const user = await User.findOne({
    email,
  });

  if (!user || !(await user.isPasswordMatch(password))) {
    errors.push(
      new ErrorObject(
        "email",
        "The email or password you entered is incorrect. Please try again."
      )
    );
    errors.push(
      new ErrorObject(
        "password",
        "The email or password you entered is incorrect. Please try again."
      )
    );
  }

  if (errors.length > 0)
    throw new ApiError(httpStatus.BAD_REQUEST, "Please try again", errors);

  const tokens = await generateAuthTokens(user);
  return res.status(200).json({ success: true, tokens, user });
});

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    if (req.headers.authorization)
      throw new ApiError(httpStatus.BAD_REQUEST, "Authenticated");

    const { email, password, username, phone, location, code } =
      req.body as any;

    const errors = [];
    if (await User.isEmailTaken(email)) {
      errors.push(
        new ErrorObject(
          "email",
          `Sorry, ${email} email has already been taken. Please choose a different email.`
        )
      );
    }

    if (await User.isUserNameTaken(username))
      errors.push(
        new ErrorObject(
          "username",
          `Sorry, ${username} username has already been taken. Please choose a different username.`
        )
      );

    // if (await User.isPhoneTaken(phone))
    //   errors.push({
    //     ...new ApiError(
    //       httpStatus.CONFLICT,
    //       `${phone} Phone number has already been registered. Please use a different phone number.`
    //     ),
    //     type: "phone",
    //   });

    if (errors.length > 0) {
      throw new ApiError(httpStatus.CONFLICT, `Sorry try again`, errors);
    }

    const user = await User.create(req.body);
    const tokens = await generateAuthTokens(user);

    res.status(httpStatus.CREATED).json({ success: true, tokens, user });
  }
);

export const logout = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  }
);

export const refreshTokens = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.status(httpStatus.OK).send(tokens);
  }
);
