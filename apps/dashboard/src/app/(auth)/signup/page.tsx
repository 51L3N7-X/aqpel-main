import React from "react";

import LogorsignCard from "@/components/auth/LogorsignCard";
import SingUpForm from "@/components/auth/SignUpForm";

export default function SingUp() {
  return (
    <div className="relative h-[100dvh] w-[100vw] ">
      <div className=" absolute size-full bg-[url('/loginBackGround.jpg')] bg-cover bg-center bg-no-repeat" />
      <div className=" absolute z-10 size-full bg-[#00000078]" />
      <LogorsignCard
        footerHeadText="Already have an account?"
        footerLinkText="Sign in"
        type="signup"
      >
        <SingUpForm text="Sign Up" />
      </LogorsignCard>
    </div>
  );
}
