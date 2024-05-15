"use client";

import type { MenuData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import ItemsContainer from "@/components/items/ItemsContainer";
import NewMenuForm from "@/components/menu/NewMenuForm";
import DialogComponent from "@/components/ui/Dialog";
import Item from "@/components/ui/Item";
import api from "@/lib/api";
import { useRestaurantStore } from "@/stores/restaurant";

export default function Menu() {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const { isLoading, data: Menus } = useQuery({
    queryKey: ["menus"],
    queryFn: async (): Promise<MenuData[]> => {
      try {
        const data = await api({
          url: `/restaurant/${restaurant.id}/menu`,
          method: "get",
        });
        return data.data;
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
