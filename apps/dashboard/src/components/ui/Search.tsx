import Image from "next/image";
import React from "react";

export default function Search() {
  return (
    <div className="relative h-[46px] w-[456px]  rounded-2xl bg-white px-6 py-3 shadow-lg ">
      <input
        type="text"
        placeholder="Search Here"
        className="h-[22px] w-full text-[22px] font-bold text-primary outline-none placeholder:text-[#0098AA4A]"
      />
      <Image
        src="/SearchIcon.svg"
        alt="Search Icon"
        className="absolute right-5 top-[9px]"
        width={24}
        height={24}
      />
    </div>
  );
}
