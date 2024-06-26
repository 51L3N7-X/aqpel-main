"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemData } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import api from "@/lib/api";
import { useRestaurantStore } from "@/stores/restaurant";
import { getS3URL } from "@/utils/getS3URL";

import FieldHeader from "../ui/FieldHeader";
import InputField from "../ui/FieldInput";
import FormErrors from "../ui/FormErrors";
import ImageSelector from "../ui/ImageSelector";
import LoadingModal from "../ui/LoadingModal";
import SaveCancelButtons from "../ui/SaveCancelButtons";

export default function NewItemForm({
  closeModal,
  menuId,
  categoryId,
}: {
  closeModal: () => void;
  menuId: string;
  categoryId: string;
}) {
  const editor = useRef(null);
  const [file, setFile] = useState<File | string>("");
  const restaurant = useRestaurantStore((state) => state.restaurant);

  const schema = z.object({
    name: z.string().min(1),
    price: z.number().min(1).max(999),
    description: z.string().max(300),
    calories: z.number().max(3),
    people: z.number().max(3),
    // new: z.boolean(),
    // special: z.boolean(),
    // ingredients: z.string(),
  });

  type ValidationSchemaType = ItemData;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ItemData) => {
      let s3url = "";
      if (file) {
        const url = await getS3URL();
        s3url = url.replace(/\?(.*)/g, "");
        const imageData = editor.current
          // @ts-ignore
          ?.getImage()
          .toDataURL("image/png") as string;
        const imageBuffer = await Buffer.from(
          imageData.replace(/^data:image\/\w+;base64,/, ""),
          "base64",
        );

        const uploaded = await axios.put(url, imageBuffer, {
          headers: { "Content-Type": "image/*" },
        });

        if (uploaded.status !== 200) {
          throw new Error("unexpected error happened");
        }
      }

      const postData = await api({
        url: `restaurant/${restaurant.id}/menu/${menuId}/category/${categoryId}/item`,
        method: "post",
        data: {
          ...data,
          ...(s3url && { imageUrl: s3url }),
        },
      });
      return postData.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      closeModal();
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ValidationSchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<ValidationSchemaType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="mx-[45px] mt-16 text-primary">
      <LoadingModal isOpen={mutation.isPending} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ImageSelector file={file} setFile={setFile} editor={editor} />

        <FormErrors mutation={mutation} />

        <FieldHeader>Item name</FieldHeader>

        <InputField register={register} name="name" />
        {errors.name && (
          <p className="text-xl font-bold text-red-500">
            * {errors.name?.message}
          </p>
        )}
        <div className="flex items-center space-x-4">
          <div className=" w-[50%]">
            <FieldHeader>Item price</FieldHeader>
            <InputField register={register} name="price" type="number" />
            {errors.price && (
              <p className="text-xl font-bold text-red-500">
                * {errors.price?.message}
              </p>
            )}
          </div>
          <div className=" w-[50%]">
            <FieldHeader>Item Calories</FieldHeader>
            <InputField register={register} name="calories" type="number" />
            {errors.calories && (
              <p className="text-xl font-bold text-red-500">
                * {errors.calories?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className=" w-[40%]">
            <FieldHeader>People</FieldHeader>
            <InputField register={register} name="people" type="number" />
            {errors.people && (
              <p className="text-xl font-bold text-red-500">
                * {errors.people.message}
              </p>
            )}
          </div>
        </div>
        <FieldHeader>Item description</FieldHeader>
        <InputField register={register} name="description" />
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
