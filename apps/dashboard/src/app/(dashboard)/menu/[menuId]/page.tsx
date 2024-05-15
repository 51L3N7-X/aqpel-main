"use client";

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import type { CategoryData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import NewCategoryForm from "@/components/categories/NewCategoryForm";
import ItemsContainer from "@/components/items/ItemsContainer";
import DialogComponent from "@/components/ui/Dialog";
import Item from "@/components/ui/Item";
import api from "@/lib/api";
import { useRestaurantStore } from "@/stores/restaurant";

export default function Page({ params }: { params: { menuId: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const router = useRouter();

  const { isLoading, data: Catagories } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryData[]> => {
      try {
        const data = await api({
          url: `/restaurant/${restaurant.id}/menu/${params.menuId}/category`,
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
        <BreadcrumbItem>Categories</BreadcrumbItem>
      </Breadcrumbs>

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
