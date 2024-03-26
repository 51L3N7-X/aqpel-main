// import type { CategoryData, ItemData, MenuData } from "@repo/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Item({ data }: { data: any }) {
  const pathname = usePathname();
  return (
    <Link href={`${pathname}/${data.id}`}>
      <div className="relative h-[288px] w-[250px] overflow-hidden rounded-[20px] shadow-item">
        {data.imageUrl && (
          <div className=" m-auto my-2 size-44">
            <Image
              src={data.imageUrl}
              alt="item image"
              width={176}
              height={176}
              className="rounded-full"
            />
          </div>
        )}
        <h1 className="my-3 text-center text-[28px] font-bold leading-5 text-primary">
          {data.name}
        </h1>
        {data.calories && (
          <div className="flex items-center justify-center space-x-3">
            <Image src="/FireIcon.svg" width={20} height={20} alt="calories" />
            <p className=" text-xs font-medium  text-primary">
              {data.calories} Calories
            </p>
          </div>
        )}
        <div className="mx-4 flex items-center space-x-[10px]">
          {data.people && (
            <h1 className=" text-lg font-semibold text-primary">
              {data.people} {data.people > 1 ? "persons" : "person"}
            </h1>
          )}
          {data.price && (
            <h1 className=" text-xl  font-extrabold text-[#FFCC36]">
              {data.price} SR
            </h1>
          )}
        </div>
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
