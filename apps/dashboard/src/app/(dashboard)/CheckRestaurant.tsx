"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import DialogComponent from "@/components/Dialog";
import NewRestaurantForm from "@/components/NewRestaurantForm";
import { useRestaurantStore } from "@/stores/restaurant";
import { fetchApi } from "@/utils/fetchApi";

export default function CheckRestaurant() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const setRestaurant = useRestaurantStore((state) => state.setRestaurant);

  const router = useRouter();

  const { data: restaurants } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["restaurants"],
    queryFn: async () => {
      const response = await fetchApi({
        url: "/restaurant",
        method: "get",
        router,
        token: localStorage.getItem("token")!,
      });
      return response;
    },
  });

  useEffect(() => {
    if (restaurants?.length) {
      setIsDialogOpen(false);
      setRestaurant(restaurants[0]);
    } else {
      setIsDialogOpen(true);
    }
  }, [restaurants, setRestaurant]);
  return (
    <DialogComponent
      onClose={() => setIsDialogOpen(false)}
      isOpen={isDialogOpen}
    >
      <NewRestaurantForm closeModal={() => setIsDialogOpen(false)} />
    </DialogComponent>
  );
}
