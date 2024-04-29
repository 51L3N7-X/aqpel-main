"use client";

import type { ItemData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";

import Item from "../Item/Item";

export function Items() {
  // { category }: { category?: string }
  const pathname = usePathname();

  const getItems = async () => {
    // eslint-disable-next-line
    const { restaurantId } = JSON.parse(localStorage.getItem("table")!);

    localStorage.setItem("restaurantId", restaurantId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${restaurantId}/items`,
    );

    console.log(response);

    const data = await response.json();

    console.log(data);

    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  console.log(data);

  if (isLoading) return <div>Loading..</div>;

  return (
    <>
      <p className="mb-2 mt-4 text-base font-semibold text-[#313638]">
        Popular Food
      </p>
      <Suspense fallback={<div>loading...</div>}>
        <div className="items relative mx-auto gap-y-6 rounded-lg pb-20 pt-2">
          {data && Object.keys(data).length && !(data.code === 404) ? (
            data?.map((item: ItemData) => (
              <Link
                href={`${pathname}/${item.id}`}
                key={`${item.id}${Math.random()}`}
              >
                <Item item={item} />
              </Link>
            ))
          ) : (
            <p>There is no items</p>
          )}
        </div>
      </Suspense>
    </>
  );
}
