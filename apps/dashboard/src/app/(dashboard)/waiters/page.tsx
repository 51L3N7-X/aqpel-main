"use client";

import type { WaiterData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import ItemsContainer from "@/components/items/ItemsContainer";
import DialogComponent from "@/components/ui/Dialog";
import Item from "@/components/ui/Item";
import NewWaiterForm from "@/components/waiter/NewWaiterForm";
import { fetchApi } from "@/utils/fetchApi";

export default function Waiters() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const { isLoading, data: waiters } = useQuery({
    queryKey: ["waiters"],
    queryFn: async (): Promise<WaiterData[]> => {
      try {
        const data = await fetchApi({
          url: `/waiter`,
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
        <AddItem text="Add Waiter" onClick={openModal} />
        {isLoading && <h1 className="text-primary">Loading...</h1>}
        {waiters &&
          waiters.map((waiter) => <Item data={waiter} key={waiter.id} />)}
      </ItemsContainer>
      <DialogComponent onClose={closeModal} isOpen={isOpen}>
        <NewWaiterForm closeModal={closeModal} />
      </DialogComponent>
    </div>
  );
}
