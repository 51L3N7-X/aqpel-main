"use client";

import type { ItemData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import DialogComponent from "@/components/ui/Dialog";
import Item from "@/components/ui/Item";
import ItemsContainer from "@/components/items/ItemsContainer";
import NewItemForm from "@/components/items/NewItemForm";
import { useRestaurantStore } from "@/stores/restaurant";
import { fetchApi } from "@/utils/fetchApi";

export default function Page({
  params,
}: {
  params: { menuId: string; categoryId: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const router = useRouter();

  const { isLoading, data: Items } = useQuery({
    queryKey: ["items"],
    queryFn: async (): Promise<ItemData[]> => {
      try {
        const data = await fetchApi({
          url: `/restaurant/${restaurant.id}/menu/${params.menuId}/category/${params.categoryId}/item`,
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
        <AddItem text="Add item" onClick={openModal} />
        {isLoading && <h1 className="text-primary">Loading...</h1>}
        {Items && Items.map((item) => <Item data={item} key={item.id} />)}
      </ItemsContainer>
      <DialogComponent onClose={closeModal} isOpen={isOpen}>
        <NewItemForm
          closeModal={closeModal}
          menuId={params.menuId}
          categoryId={params.categoryId}
        />
      </DialogComponent>
    </div>
  );
}
