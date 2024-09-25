"use client";

import type { WaiterData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import ItemsContainer from "@/components/items/ItemsContainer";
import DialogComponent from "@/components/ui/Dialog";
import Item from "@/components/ui/Item";
import WaiterForm from "@/components/waiter/Form";
// import NewWaiterForm from "@/components/waiter/NewWaiterForm";
import api from "@/lib/api";

export default function Waiters() {
  const [isOpen, setIsOpen] = useState(false);
  const [waiter, setWaiter] = useState<WaiterData | undefined>(undefined);

  const closeModal = () => {
    setWaiter(undefined);
    setIsOpen(false);
  };

  const openModal = (data: WaiterData | undefined) => {
    setWaiter(data);
    setIsOpen(true);
  };

  const { isLoading, data: waiters } = useQuery({
    queryKey: ["waiters"],
    queryFn: async (): Promise<WaiterData[]> => {
      try {
        const data = await api({
          url: `/waiter`,
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
        <AddItem text="Add Waiter" onClick={() => openModal(undefined)} />
        {isLoading && <h1 className="text-primary">Loading...</h1>}
        {waiters &&
          waiters.map((data) => (
            <Item
              link={false}
              data={data}
              key={data.id}
              onClick={() => openModal(data)}
            />
          ))}
      </ItemsContainer>
      <DialogComponent onClose={closeModal} isOpen={isOpen}>
        <WaiterForm closeModal={closeModal} waiter={waiter} />
      </DialogComponent>
    </div>
  );
}
