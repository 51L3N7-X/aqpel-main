"use client";

import type { FloorData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import NewFloorForm from "@/components/floors/NewFloorForm";
import ItemsContainer from "@/components/items/ItemsContainer";
import DialogComponent from "@/components/ui/Dialog";
import NumericItem from "@/components/ui/NumericItem";
import api from "@/lib/api";

export default function Tables() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const { isLoading, data: floors } = useQuery({
    queryKey: ["floors"],
    queryFn: async (): Promise<FloorData[]> => {
      try {
        const data = await api({
          url: `/floor`,
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
        <AddItem text="Add floor" onClick={openModal} />
        {isLoading && <h1 className="text-primary">Loading...</h1>}
        {floors &&
          floors.map((floor) => <NumericItem data={floor} key={floor.id} />)}
      </ItemsContainer>
      <DialogComponent onClose={closeModal} isOpen={isOpen}>
        <NewFloorForm closeModal={closeModal} />
      </DialogComponent>
    </div>
  );
}
