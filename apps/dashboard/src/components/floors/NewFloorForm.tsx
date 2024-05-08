import { zodResolver } from "@hookform/resolvers/zod";
import type { FloorData } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fetchApi } from "@/utils/fetchApi";

import FieldHeader from "../ui/FieldHeader";
import FieldInput from "../ui/FieldInput";
import FormErrors from "../ui/FormErrors";
import Loading from "../ui/Loading";
import SaveCancelButtons from "../ui/SaveCancelButtons";

export default function NewFloorForm({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const schema = z.object({
    number: z.number().min(0).max(99),
  });

  const queryClient = useQueryClient();

  type ValidationSchemaType = FloorData;

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: FloorData) => {
      const floor = await fetchApi({
        url: "/floor",
        method: "post",
        router,
        token: localStorage.getItem("token")!,
        data,
      });
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      return floor;
    },
    onSuccess: () => {
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
        <FormErrors mutation={mutation} />
        <FieldHeader>Floor Number</FieldHeader>
        <FieldInput
          name="number"
          register={register}
          type="number"
          min={0}
          max={99}
        />
        {errors.number && (
          <p className="text-xl font-bold text-red-500">
            * {errors.number.message}
          </p>
        )}
        <SaveCancelButtons closeModal={closeModal} />
      </form>
    </div>
  );
}
