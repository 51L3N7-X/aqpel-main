"use client";

import type { CategoryData } from "@repo/types";
import React from "react";
import useSWR from "swr";

import CategorieItem from "./CategorieItem";

export default function Categories() {
  //   {
  //   categoriesItems,
  // }: {
  //   categoriesItems?: string[];
  // }
  const getCategories = async () => {
    // eslint-disable-next-line
    const { restaurantId } = JSON.parse(localStorage.getItem("table")!);

    localStorage.setItem("restaurantId", restaurantId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${restaurantId}/categories`,
    );

    const data = await response.json();

    return data;
  };

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/`,
    getCategories,
  );

  if (isLoading) return <div>Loading..</div>;
  return (
    <>
      <p className="mb-[9px] text-base font-semibold text-[#313638]">
        Categories
      </p>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="categoriesItems mx-auto flex items-center justify-start gap-x-2 overflow-x-scroll pb-1">
        <CategorieItem name="All" />
        {data &&
          Object.keys(data).length &&
          data.map((category: CategoryData) => (
            <CategorieItem
              name={category.name}
              key={category.id}
              imageURL={category.imageUrl}
            />
          ))}
      </div>
    </>
  );
}
