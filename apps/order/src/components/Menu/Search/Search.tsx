import Image from "next/image";
import React from "react";

export default function Search() {
  return (
    <div className="mb-4 mt-[20px] rounded-[10px] bg-[rgb(239,239,239)]/40 backdrop-blur-[1px]">
      <div className="flex items-center gap-x-[6px] px-4 py-[10px]">
        <Image
          width={20}
          height={20}
          alt="search-icon"
          src="/menu/Search.svg"
          style={{ height: "auto", width: "auto" }}
        />
        <input
          type="text"
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="text-[rgb(255,255,255)]/47 w-full rounded-[10px] border-none bg-transparent text-[16px] font-semibold outline-none focus:text-[1px] focus:font-semibold focus:text-white"
          placeholder="Search your favorite food"
        />
      </div>
    </div>
  );
}
