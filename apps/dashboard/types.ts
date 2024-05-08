import type { FieldError, UseFormRegister } from "react-hook-form";

export type SignUpFormData = {
  username: string;
  email: string;
  password: string;
};

export type SignInFormData = {
  email: string;
  password: string;
};

export type SignUpFormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidSignUpFieldNames;
  register: UseFormRegister<SignUpFormData>;
  error: FieldError | undefined;
};

export type SignInFormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidSignInFieldNames;
  register: UseFormRegister<SignInFormData>;
  error: FieldError | undefined;
};

export type LogorsignProps = {
  children: React.ReactNode;
  footerHeadText: string;
  footerLinkText: string;
  type: "signin" | "signup";
};

export type ValidSignUpFieldNames = "email" | "password" | "username";

export type ValidSignInFieldNames = "password" | "email";
