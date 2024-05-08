"use client";

import type { MenuData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import DialogComponent from "@/components/ui/Dialog";
import Item from "@/components/ui/Item";
import ItemsContainer from "@/components/items/ItemsContainer";
import NewMenuForm from "@/components/menu/NewMenuForm";
import { useRestaurantStore } from "@/stores/restaurant";
import { fetchApi } from "@/utils/fetchApi";

export default function Menu() {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const { isLoading, data: Menus } = useQuery({
    queryKey: ["menus", restaurant.id],
    queryFn: async (): Promise<MenuData[]> => {
      try {
        const data = await fetchApi({
          url: `/restaurant/${restaurant.id}/menu`,
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
  return (
    <div className="relative">
      <ItemsContainer>
        <AddItem text="Add menu" onClick={openModal} />
        {isLoading && <h1 className="text-primary">Loading...</h1>}
        {Menus && Menus.map((menu) => <Item data={menu} key={menu.id} />)}
      </ItemsContainer>
      <DialogComponent onClose={closeModal} isOpen={isOpen}>
        <NewMenuForm closeModal={closeModal} />
      </DialogComponent>
    </div>
  );
}
