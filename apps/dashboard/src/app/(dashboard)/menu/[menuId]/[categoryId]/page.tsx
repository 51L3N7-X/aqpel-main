"use client";

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import type { ItemData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import ItemsContainer from "@/components/items/ItemsContainer";
import NewItemForm from "@/components/items/NewItemForm";
import DialogComponent from "@/components/ui/Dialog";
// import DialogComponent from "@/components/ui/Dialog";
import Item from "@/components/ui/Item";
import api from "@/lib/api";
import { useRestaurantStore } from "@/stores/restaurant";

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
        const data = await api({
          url: `/restaurant/${restaurant.id}/menu/${params.menuId}/category/${params.categoryId}/item`,
          method: "get",
        });
        return data.data;
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
      <Breadcrumbs className="mt-6" size="lg">
        <BreadcrumbItem>
          <button
            type="button"
            onClick={() => {
              router.replace(`/menu`);
            }}
          >
            Menu
          </button>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <button
            type="button"
            onClick={() => {
              router.replace(`/menu/${params.menuId}`);
            }}
          >
            Categories
          </button>
        </BreadcrumbItem>
        <BreadcrumbItem>Items</BreadcrumbItem>
      </Breadcrumbs>
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
