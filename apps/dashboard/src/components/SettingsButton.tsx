import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SettingsButton() {
  return (
    <Link href="/settings">
      {/* eslint-disable-next-line tailwindcss/classnames-order */}
      <div className="shadow-fi mr-12 flex size-[46px] items-center justify-center rounded-[10px] bg-[#F3F3F3]">
        <Image
          src="/TopSettingsIcon.svg"
          height={24}
          width={24}
          alt="Settings"
        />
      </div>
    </Link>
  );
}
