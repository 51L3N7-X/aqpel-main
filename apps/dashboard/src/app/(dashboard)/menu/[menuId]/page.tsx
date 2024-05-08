"use client";

import type { CategoryData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import DialogComponent from "@/components/ui/Dialog";
import Item from "@/components/ui/Item";
import ItemsContainer from "@/components/items/ItemsContainer";
import NewCategoryForm from "@/components/categories/NewCategoryForm";
import { useRestaurantStore } from "@/stores/restaurant";
import { fetchApi } from "@/utils/fetchApi";

export default function Page({ params }: { params: { menuId: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const router = useRouter();

  const { isLoading, data: Catagories } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryData[]> => {
      try {
        const data = await fetchApi({
          url: `/restaurant/${restaurant.id}/menu/${params.menuId}/category`,
          method: "get",
          router,
          token: localStorage.getItem("token")!,
        });
        return data;
      } catch (e: any) {
        if (e.response.data.code === 404) return [];
        throw e;
      }
    },
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div>
      <ItemsContainer>
        <AddItem text="Add category" onClick={openModal} />
        {isLoading && <h1 className="text-primary">Loading...</h1>}
        {Catagories &&
          Catagories.map((category) => (
            <Item data={category} key={category.id} />
          ))}
      </ItemsContainer>
      <DialogComponent onClose={closeModal} isOpen={isOpen}>
        <NewCategoryForm closeModal={closeModal} menuId={params.menuId} />
      </DialogComponent>
    </div>
  );
}
