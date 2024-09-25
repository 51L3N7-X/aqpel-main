import React from "react";
import type { UseFormRegister } from "react-hook-form";

export default function FieldInput({
  name,
  register,
  placeholder,
  type = "text",
  min,
  max,
  ...rest
}: {
  name: string;
  register: UseFormRegister<any>;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  min?: number;
  max?: number;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="rounded-[10px] border border-primary py-3 pl-6">
      <input
        type={type}
        className="h-6 w-full text-[24px] font-bold text-primary outline-none"
        {...register(name, {
          setValueAs: (v) => (type === "number" ? parseInt(v, 10) : v),
        })}
        placeholder={placeholder}
        min={min}
        max={max}
        autoComplete="off"
        {...rest}
      />
    </div>
  );
}
