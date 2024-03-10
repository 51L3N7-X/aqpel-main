"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function TopBar({ title }: { title: string }) {
  const pathname = usePathname();

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-b-3xl shadow-[-1px_4px_4px_1px_rgba(172,172,172,0.25)]">
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="logo-bg flex h-full items-center justify-center bg-white2 font-poppins ">
        <h2 className="text-[28px] font-medium text-text">{title}</h2>
        <Link
          href={pathname.substring(0, pathname.lastIndexOf("/"))}
          className="z-10"
        >
          <div className="absolute left-6 top-9 flex size-11 items-center justify-center rounded-full bg-yellow1 bg-no-repeat">
            <svg
              width="21"
              height="18"
              viewBox="0 0 21 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.440674 7.9406C-0.145264 8.52654 -0.145264 9.4781 0.440674 10.064L7.94067 17.564C8.52661 18.15 9.47817 18.15 10.0641 17.564C10.65 16.9781 10.65 16.0265 10.0641 15.4406L5.1188 10.5H19.5C20.3297 10.5 21 9.82966 21 8.99998C21 8.17029 20.3297 7.49998 19.5 7.49998H5.12349L10.0594 2.55935C10.6454 1.97341 10.6454 1.02185 10.0594 0.435913C9.47349 -0.150024 8.52192 -0.150024 7.93599 0.435913L0.435986 7.93591L0.440674 7.9406Z"
                fill="#FDFDFD"
              />
            </svg>
          </div>
        </Link>
      </div>
      <div
        className="absolute left-0 top-0 size-full bg-cover bg-fixed bg-center opacity-10"
        style={{ backgroundImage: `url("/menu/foodbackground.png")` }}
      />
    </div>
  );
}
