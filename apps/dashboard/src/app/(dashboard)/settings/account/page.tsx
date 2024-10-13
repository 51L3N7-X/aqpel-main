"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { Pencil, User } from "lucide-react";
import Image from "next/image";
import type { HTMLInputTypeAttribute } from "react";
import React, { useEffect, useRef, useState } from "react";
import type { UseFormRegister } from "react-hook-form";
import { useForm } from "react-hook-form";

import FormErrors from "@/components/ui/FormErrors";
import ImageSelector from "@/components/ui/ImageSelector";
import LoadingModal from "@/components/ui/LoadingModal";
import api from "@/lib/api";
import { useUserStore } from "@/stores/user";
import { handleImageUpload } from "@/utils/handleImageUpload";

const InputHeader = ({ children }: { children: string }) => (
  <h3 className="text-lg text-primary">{children}</h3>
);

const InputFiled = ({
  type,
  placeholder,
  register,
  ...rest
}: {
  type: HTMLInputTypeAttribute;
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="max-w-[250px] overflow-hidden rounded-[10px] border border-primary px-3 py-1">
    <input
      type={type}
      {...register(rest.name, {
        setValueAs: (v) => (type === "number" ? parseInt(v, 10) : v),
      })}
      className="h-6 w-full text-base font-bold text-primary outline-none"
      placeholder={placeholder}
      autoComplete="off"
      {...rest}
    />
  </div>
);

export default function Account() {
  const { handleSubmit, register, setValue } = useForm();

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [file, setFile] = useState<string | File>("");
  const editor = useRef(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const s3url = await handleImageUpload(file, editor);
      const postData = await api({
        url: "user",
        method: "PATCH",
        data: {
          photoURL: s3url || "",
        },
      });
      return postData.data;
    },
    // eslint-disable-next-line @typescript-eslint/no-redeclare
    onSuccess: (data) => {
      setUser(data);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const editData = await api({
        url: "user",
        method: "PATCH",
        data: {
          ...data,
        },
      });
      return editData.data;
    },

    onSuccess: (data) => setUser(data),
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("name", user.name);
    }
  }, [user, setValue]);

  // console.log(user);

  return (
    <div className="mt-8">
      <div className="relative mb-4 size-28 rounded-full">
        {user?.photoURL ? (
          <Image
            alt="photo"
            width={112}
            height={112}
            src={user.photoURL}
            className="rounded-full"
          />
        ) : (
          <User
            size={112}
            className="rounded-full border border-black/25"
            color="#0098AA"
            // absoluteStrokeWidth
            strokeWidth={1}
          />
        )}
        <div
          className="absolute bottom-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white1 shadow-lg"
          onClick={onOpen}
          role="button"
          tabIndex={0}
          aria-label="edit"
          aria-hidden="true"
        >
          <Pencil absoluteStrokeWidth size={23} color="#0098AA" />
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onCloseFn) => (
              <>
                <LoadingModal isOpen={mutation.isPending} />
                <ModalHeader className="flex flex-col gap-1 text-lg font-bold text-primary">
                  Change Photo
                </ModalHeader>
                <ModalBody>
                  <ImageSelector
                    file={file}
                    setFile={setFile}
                    editor={editor}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    className="h-11 text-[18px]"
                    onPress={onCloseFn}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    className="h-11 text-[18px]"
                    onPress={() => mutation.mutate()}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <LoadingModal isOpen={updateMutation.isPending} />
      <FormErrors mutation={updateMutation} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row gap-4">
          <div>
            <InputHeader>Name</InputHeader>
            <InputFiled type="text" name="name" register={register} />
          </div>
          <div>
            <InputHeader>Username</InputHeader>
            <InputFiled type="text" name="username" register={register} />
          </div>
        </div>
        <Button type="submit" color="primary" variant="shadow" className="mt-4">
          Save
        </Button>
      </form>
    </div>
  );
}
