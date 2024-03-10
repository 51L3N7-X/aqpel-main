// import type { Dispatch } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ImageSelector from "./ImageSelector";

export default function NewMenuForm({
  //   file,
  //   setFile,
  closeModal,
  //   onSave,
}: {
  //   file: File | string;
  //   setFile: Dispatch<File | string>;
  closeModal: () => void;
  //   onSave: () => void;
}) {
  const [file, setFile] = useState<File | string>("");

  const schema = z.object({
    menu: z.string().min(1),
  });

  type ValidationSchemaType = z.infer<typeof schema> & { restaurantId: string };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ValidationSchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<ValidationSchemaType> = (data) => {
    console.log(data);
    closeModal();
  };

  return (
    <div className="mx-[45px] mt-16 text-primary">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ImageSelector file={file} setFile={setFile} />
        <h1 className="mb-3 text-2xl font-bold">Menu name</h1>
        <div className="rounded-[10px] border border-primary py-3 pl-6">
          <input
            type="text"
            className="h-6 w-full text-[24px]  font-bold text-primary outline-none"
            {...register("menu")}
          />
        </div>
        {errors.menu && (
          <p className="  text-xl font-bold text-red-500">
            * {errors.menu?.message}
          </p>
        )}
        <div className="mb-14 mt-[84px] flex w-full justify-between">
          <button
            type="submit"
            aria-hidden
            className=" flex h-11 w-[220px] cursor-pointer items-center justify-center rounded-[10px] bg-primary text-white1 outline-none"
          >
            <p className="text-2xl">Save</p>
          </button>
          <div
            onClick={closeModal}
            aria-hidden
            className="flex h-11 w-[220px] cursor-pointer items-center justify-center rounded-[10px] border border-primary"
          >
            <p className="text-2xl  font-bold text-primary">Cancel</p>
          </div>
        </div>
      </form>
    </div>
  );
}
