import { zodResolver } from "@hookform/resolvers/zod";
import type { RestaurantData } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRestaurantStore } from "@/stores/restaurant";
import { fetchApi } from "@/utils/fetchApi";

import FieldHeader from "./FieldHeader";
import FieldInput from "./FieldInput";
import Loading from "./Loading";
import SaveCancelButtons from "./SaveCancelButtons";

export default function NewRestaurantForm({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const schema = z.object({
    name: z.string().min(1),
    description: z.string().max(500),
  });

  const setRestaurant = useRestaurantStore((state) => state.setRestaurant);

  const queryClient = useQueryClient();

  type ValidationSchemaType = RestaurantData;

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: RestaurantData) => {
      const restaurant = await fetchApi({
        url: "/restaurant",
        method: "post",
        router,
        token: localStorage.getItem("token")!,
        data,
      });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      return restaurant;
    },
    onSuccess: (data) => {
      setRestaurant(data);
      closeModal();
    },
  });

  const onSubmit: SubmitHandler<ValidationSchemaType> = (data) => {
    mutation.mutate(data);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ValidationSchemaType>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="mx-[45px] mt-16 text-primary">
      <Loading isOpen={mutation.isPending} />
      <form onSubmit={handleSubmit(onSubmit)}>
        {mutation.error instanceof AxiosError &&
          ((mutation.error?.response?.data?.errors?.length &&
            mutation.error.response.data.errors.map(
              (error: { message: string }) => (
                <p
                  className="text-xl font-bold text-red-500"
                  key={error.message}
                >
                  * {error.message}
                </p>
              ),
            )) ||
            (mutation.error?.response?.data?.message && (
              <p className="text-xl font-bold text-red-500">
                {mutation.error.response.data.message}
              </p>
            )) || (
              <p className="text-xl font-bold text-red-500">
                * {mutation.error.message}
              </p>
            ))}
        <FieldHeader>Restaurant Name</FieldHeader>
        <FieldInput name="name" register={register} />
        {errors.name && (
          <p className="text-xl font-bold text-red-500">
            * {errors.name.message}
          </p>
        )}
        <FieldHeader>Restaurant Description</FieldHeader>
        <FieldInput name="description" register={register} />
        {errors.description && (
          <p className="text-xl font-bold text-red-500">
            * {errors.description.message}
          </p>
        )}
        <SaveCancelButtons closeModal={closeModal} />
      </form>
    </div>
  );
}
