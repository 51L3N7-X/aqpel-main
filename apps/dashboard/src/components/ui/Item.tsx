// import type { CategoryData, ItemData, MenuData } from "@repo/types";
import { Image as EmptyImage } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ItemProps extends React.HTMLProps<HTMLDivElement> {
  data: any;
  link?: boolean;
}

export default function Item({ data, link = true, ...rest }: ItemProps) {
  const pathname = usePathname();
  return (
    <div {...rest}>
      <Link href={link ? `${pathname}/${data.id}` : ""}>
        <div className=" relative flex  h-[288px] w-[250px] flex-col items-center justify-center overflow-hidden rounded-[20px] shadow-item">
          <div className=" m-auto my-2 size-44">
            {data.imageUrl || data.photoUrl ? (
              <Image
                src={data.imageUrl || data.photoUrl}
                alt="item image"
                width={176}
                height={176}
                className="size-[176px] rounded-full"
              />
            ) : (
              <EmptyImage
                size={176}
                className="rounded-full"
                color="#0098AA"
                absoluteStrokeWidth
              />
            )}
          </div>

          <h1 className="my-3 text-center text-[28px] font-bold leading-5 text-primary">
            {data.name}
          </h1>
          {data.calories && (
            <div className="flex items-center justify-center space-x-3">
              <Image
                src="/FireIcon.svg"
                width={20}
                height={20}
                alt="calories"
              />
              <p className=" text-xs font-medium  text-primary">
                {data.calories} Calories
              </p>
            </div>
          )}
          <div className="ml-4 w-full">
            <div className="flex items-center justify-start space-x-[10px]">
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
    </div>
  );
}
