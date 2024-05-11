import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectItem } from "@nextui-org/select";
import type { TableData } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useRestaurantStore } from "@/stores/restaurant";
import { fetchApi } from "@/utils/fetchApi";

import FieldHeader from "../ui/FieldHeader";
import FieldInput from "../ui/FieldInput";
import FormErrors from "../ui/FormErrors";
import LoadingModal from "../ui/LoadingModal";
import SaveCancelButtons from "../ui/SaveCancelButtons";

export default function NewTableForm({
  closeModal,
  floorId,
}: {
  closeModal: () => void;
  floorId: string;
}) {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const schema = z.object({
    number: z.number().min(0).max(99),
    shape: z.enum(["square", "circle"]).default("square"),
    chairs: z.number().min(1).max(6).default(2),
  });

  const queryClient = useQueryClient();

  type ValidationSchemaType = TableData;

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: TableData) => {
      const table = await fetchApi({
        url: `/floor/${floorId}/table`,
        method: "post",
        router,
        token: localStorage.getItem("token")!,
        data: { ...data, restaurantId: restaurant.id },
      });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      return table;
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
    control,
    formState: { errors },
  } = useForm<ValidationSchemaType>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="mx-[45px] mt-16 text-primary">
      <LoadingModal isOpen={mutation.isPending} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormErrors mutation={mutation} />
        <FieldHeader>Table Number</FieldHeader>
        <FieldInput
          name="number"
          register={register}
          type="number"
          min={1}
          max={99}
        />
        {errors.number && (
          <p className="text-xl font-bold text-red-500">
            * {errors.number.message}
          </p>
        )}
        <div className="flex w-full justify-between">
          <div>
            <FieldHeader>Chairs Number</FieldHeader>
            <Controller
              name="chairs"
              control={control}
              render={({ field: { onChange } }) => (
                <Select
                  onChange={(v) => onChange(+v.target.value)}
                  variant="bordered"
                  className="w-[180px]"
                  size="lg"
                  // isRequired
                  isInvalid={!!errors.chairs}
                  errorMessage={errors.chairs?.message}
                  placeholder="2"
                  classNames={{
                    trigger: "border-primary",
                  }}
                  renderValue={(items) =>
                    items.map((item) => (
                      <h3 className=" text-xl font-bold text-primary">
                        {item.textValue}
                      </h3>
                    ))
                  }
                >
                  {["1", "2", "3", "4", "5", "6"].map((number) => (
                    <SelectItem key={number} textValue={number}>
                      <h3 className="text-lg font-semibold text-primary">
                        {number}
                      </h3>
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
          <div>
            <FieldHeader>Table Shape</FieldHeader>
            <Select
              variant="bordered"
              className="w-[180px]"
              size="lg"
              isRequired
              {...register("shape")}
              isInvalid={!!errors.shape}
              errorMessage={errors.shape?.message}
              placeholder="square"
              classNames={{
                trigger: "border-primary",
              }}
              renderValue={(items) =>
                items.map((item) => (
                  <h3 className=" text-xl font-bold text-primary">
                    {item.textValue}
                  </h3>
                ))
              }
            >
              <SelectItem textValue="square" key="square">
                <h3 className="text-lg font-semibold text-primary">Square</h3>
              </SelectItem>
              <SelectItem textValue="circle" key="circle">
                <h3 className="text-lg font-semibold text-primary">Circle</h3>
              </SelectItem>
            </Select>
          </div>
        </div>
        <SaveCancelButtons closeModal={closeModal} />
      </form>
    </div>
  );
}
