import React from "react";
import type { SignUpFormFieldProps } from "types";

const SignUpFormField: React.FC<SignUpFormFieldProps> = ({
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

/* {error && <span className="error-message">{error.message}</span>} */

export default SignUpFormField;
