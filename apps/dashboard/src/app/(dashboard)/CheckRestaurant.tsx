"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import NewRestaurantForm from "@/components/restaurant/NewRestaurantForm";
import DialogComponent from "@/components/ui/Dialog";
import LoadingModal from "@/components/ui/LoadingModal";
import api from "@/lib/api";
import { useRestaurantStore } from "@/stores/restaurant";

export default function CheckRestaurant() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const setRestaurant = useRestaurantStore((state) => state.setRestaurant);

  const { data: restaurants, isLoading } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["restaurants"],
    queryFn: async () => {
      const response = await api({
        url: "/restaurant",
        method: "get",
      });
      return response.data;
    },
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (restaurants?.length) {
      setIsDialogOpen(false);
      setRestaurant(restaurants[0]);
    }
    if (!isLoading && !restaurants?.length) {
      setIsDialogOpen(true);
    }
  });
  return (
    <>
      {isLoading && <LoadingModal isOpen text="Loading..." />}
      <DialogComponent
        onClose={() => setIsDialogOpen(false)}
        isOpen={isDialogOpen}
      >
        <NewRestaurantForm closeModal={() => setIsDialogOpen(false)} />
      </DialogComponent>
    </>
  );
}
