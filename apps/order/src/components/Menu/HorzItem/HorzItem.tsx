"use client";

import Image from "next/image";
import React from "react";

export default function HorzItem({
  name,
  price,
  image,
  count,
}: {
  name: string;
  price: string;
  image?: string | null;
  count?: number;
}) {
  return (
    <div className="relative mx-6 mt-6 h-20 rounded-l-[28px] rounded-r-2xl bg-white2 shadow-[0px_2px_4px_1px_rgba(0,0,0,0.18)]">
      <div className="mr-4 flex h-full items-center justify-end">
        <div className="flex h-full min-w-[33.3%] max-w-fit flex-col items-center justify-center gap-1">
          <p className="text-base font-semibold text-text">{name}</p>
          {count && (
            <p className="text-[12px] font-semibold text-gray1">
              {count}
              {count > 1 ? "pieces" : "piece"}
            </p>
          )}
        </div>
        <div className="flex h-full w-1/3 items-center justify-end">
          <p className="text-lg font-semibold text-yellow1">{price}</p>
        </div>
      </div>
      {image && (
        <Image
          src={image}
          height={96}
          width={96}
          alt="food"
          style={{
            position: "absolute",
            left: "-2%",
            top: "-14%",
            zIndex: "10",
            height: "96px",
            width: "96px",
            borderRadius: "128px",
          }}
        />
      )}
    </div>
  );
}
