import type { SignInFormData, SignUpFormData } from "types";
import type { ZodType } from "zod";
import { z } from "zod";

export const SignUpUserSchema: ZodType<SignUpFormData> = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password is too short!")
    .max(20, "Password is too long"),
  username: z
    .string()
    .trim()
    .min(1, "Username must contain at least 1 character(s)"),
});

export const SignInUserSchema: ZodType<SignInFormData> = z.object({
  email: z.string().min(1).email(),
  password: z
    .string()
    .min(8, "Password is too short!")
    .max(20, "Password is too long"),
});
