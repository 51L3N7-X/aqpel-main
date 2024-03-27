import React from "react";

import LogorsignCard from "@/components/auth/LogorsignCard";
import SignInForm from "@/components/auth/SignInForm";

export default function SingUp() {
  return (
    <div className="relative  h-dvh w-screen ">
      <div className=" absolute size-full bg-[url('/loginBackGround.jpg')] bg-cover bg-center bg-no-repeat" />
      <div className=" absolute z-10 size-full bg-[#00000078]" />
      <LogorsignCard
        footerHeadText="New here?"
        footerLinkText="Create an account"
        type="signin"
      >
        <SignInForm text="Sign In" />
      </LogorsignCard>
    </div>
  );
}
