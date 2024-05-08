"use client";

import type { TableData } from "@repo/types";
import Image from "next/image";
import React from "react";

export default function TableItem({
  table,
  onClick,
}: {
  table: TableData;
  onClick: () => void;
}) {
  return (
    <div
      className="relative h-[288px] w-[250px] overflow-hidden rounded-[20px] shadow-item"
      onKeyDown={() => {}}
      role="button"
      onClick={onClick}
      tabIndex={0}
    >
      <div className="mt-6 flex cursor-pointer items-center justify-center">
        <Image
          src={`/${table.chairs}${table.shape}.svg`}
          alt="Table Icon"
          width={150}
          height={150}
          style={{
            width: "150px",
            height: "150px",
          }}
        />
      </div>
      <h3 className="mt-4 text-center font-mrk text-7xl font-bold text-primary">
        {table.number}
      </h3>
      <Image
        width={20}
        height={20}
        src="/EditIcon.svg"
        alt="edit"
        className="absolute bottom-4 right-4"
      />
    </div>
  );
}
