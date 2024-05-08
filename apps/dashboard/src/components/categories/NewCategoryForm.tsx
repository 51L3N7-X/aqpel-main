"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CategoryData } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRestaurantStore } from "@/stores/restaurant";
import { fetchApi } from "@/utils/fetchApi";
import { getS3URL } from "@/utils/getS3URL";

import FieldHeader from "../ui/FieldHeader";
import InputField from "../ui/FieldInput";
import FormErrors from "../ui/FormErrors";
import ImageSelector from "../ui/ImageSelector";
import Loading from "../ui/Loading";
import SaveCancelButtons from "../ui/SaveCancelButtons";

export default function NewCategoryForm({
  closeModal,
  menuId,
}: {
  closeModal: () => void;
  menuId: string;
}) {
  const editor = useRef(null);
  const [file, setFile] = useState<File | string>("");
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const router = useRouter();

  const schema = z.object({
    name: z.string().min(1),
    description: z.string().max(300),
  });

  type ValidationSchemaType = CategoryData;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      let s3url = "";
      if (file) {
        const url = await getS3URL(router);
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

      const postData = await fetchApi({
        url: `restaurant/${restaurant.id}/menu/${menuId}/category`,
        method: "post",
        data: {
          ...data,
          ...(s3url && { imageUrl: s3url }),
        },
        token: localStorage.getItem("token")!,
        router,
      });
      return postData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
    mutation.mutateAsync(data);
  };

  return (
    <div className="mx-[45px] mt-16 text-primary">
      <Loading isOpen={mutation.isPending} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ImageSelector file={file} setFile={setFile} editor={editor} />
        <FormErrors mutation={mutation} />
        <FieldHeader>Category name</FieldHeader>
        <InputField register={register} name="name" />
        {errors.name && (
          <p className="text-xl font-bold text-red-500">
            * {errors.name?.message}
          </p>
        )}
        <FieldHeader>Category description</FieldHeader>
        <InputField register={register} name="description" />
        {errors.description && (
          <p className="text-xl font-bold text-red-500">
            * {errors.description?.message}
          </p>
        )}
        <SaveCancelButtons closeModal={closeModal} />
      </form>
    </div>
  );
}
