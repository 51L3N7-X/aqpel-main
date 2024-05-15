"use client";

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import type { TableData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import ItemsContainer from "@/components/items/ItemsContainer";
import NewTableForm from "@/components/tables/NewTableForm";
import TableDetails from "@/components/tables/TableDetails";
import TableItem from "@/components/tables/TableItem";
import DialogComponent from "@/components/ui/Dialog";
import api from "@/lib/api";

export default function Page({
  params: { floorId },
}: {
  params: { floorId: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const router = useRouter();

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
  };

  const openItemModal = (ID: string) => {
    setId(ID);
    setIsItemModalOpen(true);
  };

  const { isLoading, data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: async (): Promise<TableData[]> => {
      try {
        const data = await api({
          url: `/floor/${floorId}/table`,
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
      <Breadcrumbs className="mt-6" size="lg">
        <BreadcrumbItem>
          <button
            type="button"
            onClick={() => {
              router.replace(`/tables`);
            }}
          >
            Floors
          </button>
        </BreadcrumbItem>
        <BreadcrumbItem>Tables</BreadcrumbItem>
      </Breadcrumbs>

      <ItemsContainer>
        <AddItem text="Add Table" onClick={openModal} />
        {isLoading && <h1 className="text-primary">Loading...</h1>}
        {tables &&
          tables.map((table) => (
            <div>
              <TableItem
                key={table.id}
                table={table}
                onClick={() => openItemModal(table.id)}
              />
            </div>
          ))}
      </ItemsContainer>
      <DialogComponent onClose={closeModal} isOpen={isOpen} type="table">
        <NewTableForm closeModal={closeModal} floorId={floorId} />
      </DialogComponent>
      <DialogComponent
        onClose={closeItemModal}
        isOpen={isItemModalOpen}
        type="table"
      >
        <TableDetails floorId={floorId} tableId={id} />
      </DialogComponent>
    </div>
  );
}
