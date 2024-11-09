import type { HTMLInputTypeAttribute } from "react";
import type { UseFormRegister } from "react-hook-form";

export const InputFiled = ({
  type,
  placeholder,
  register,
  ...rest
}: {
  type: HTMLInputTypeAttribute;
  name: string;
  placeholder?: string;
  // eslint-disable-next-line prettier/prettier
  register: UseFormRegister<any>;
  // eslint-disable-next-line prettier/prettier
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="max-w-[250px] overflow-hidden rounded-[10px] border border-primary px-3 py-1">
    <input
      type={type}
      {...register(rest.name, {
        setValueAs: (v) => (type === "number" ? parseInt(v, 10) : v),
      })}
      className="h-6 w-full text-base font-bold text-primary outline-none"
      placeholder={placeholder}
      autoComplete="off"
      {...rest}
    />
  </div>
);
