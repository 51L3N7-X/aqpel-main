import React from "react";
import type { SignInFormFieldProps } from "types";

const SignInFormField: React.FC<SignInFormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  //   error,
}) => (
  <input
    type={type}
    placeholder={placeholder}
    {...register(name)}
    className="w-[90%]"
  />
);

export default SignInFormField;
