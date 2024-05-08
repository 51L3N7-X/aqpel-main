import type { FloorData } from "@repo/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NumericItem({ data }: { data: FloorData }) {
  const pathname = usePathname();
  return (
    <Link href={`${pathname}/${data.id}`}>
      <div className="relative h-[288px] w-[250px] overflow-hidden rounded-[20px] shadow-item">
        <h1 className="my-3 w-full text-pretty text-center font-mrk text-[10rem] font-extrabold text-primary">
          {data.number}
        </h1>
        <Image
          width={20}
          height={20}
          src="/EditIcon.svg"
          alt="edit"
          className="absolute bottom-4 right-4"
        />
      </div>
    </Link>
  );
}
