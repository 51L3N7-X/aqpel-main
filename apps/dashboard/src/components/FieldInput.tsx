import React from "react";

export default function FieldInput({
  name,
  register,
  placeholder,
  type = "text",
}: {
  name: string;
  register: any;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <div className="rounded-[10px] border border-primary py-3 pl-6">
      <input
        type={type}
        className="h-6 w-full text-[24px]  font-bold text-primary outline-none"
        {...register(name)}
        placeholder={placeholder}
      />
    </div>
  );
}
