import Link from "next/link";
import React from "react";
import type { LogorsignProps } from "types";

export default function LogorsignCard({
  type,
  footerHeadText,
  footerLinkText,
  children,
}: LogorsignProps) {
  const text = type === "signin" ? "Sign in" : "Sign Up";
  return (
    <div className=" absolute top-[12dvh] z-50 min-w-[390px] max-w-[470px] rounded-[20px] bg-white p-8 sm:right-[10%] sm:top-[8dvh] sm:min-w-[470px]">
      <h1 className=" mb-4 text-3xl font-bold  text-primary">{text}</h1>
      <p className=" mb-9 text-2xl font-medium text-primary">
        Welcome to Aqpel
      </p>
      {children}
      <div className=" mt-2 flex gap-x-[6px] text-primary">
        <p className=" text-xl font-bold  ">{footerHeadText}</p>
        <Link href={type === "signin" ? "/signup" : "/signin"} className="">
          <p className=" cursor-pointer text-lg font-medium underline">
            {footerLinkText}
          </p>
        </Link>
      </div>
    </div>
  );
}
