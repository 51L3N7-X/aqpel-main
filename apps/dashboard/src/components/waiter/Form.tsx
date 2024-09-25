/* eslint-disable @typescript-eslint/no-use-before-define */
import { zodResolver } from "@hookform/resolvers/zod";
import { Accordion, AccordionItem, Divider } from "@nextui-org/react";
import type { FloorData, WaiterData } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import type { FieldError, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import api from "@/lib/api";
import { useRestaurantStore } from "@/stores/restaurant";
import { getS3URL } from "@/utils/getS3URL";

import FieldHeader from "../ui/FieldHeader";
import InputField from "../ui/FieldInput";
import FormErrors from "../ui/FormErrors";
import ImageSelector from "../ui/ImageSelector";
import Loading from "../ui/Loading";
import LoadingModal from "../ui/LoadingModal";
import SaveCancelButtons from "../ui/SaveCancelButtons";
import { CheckBoxTables } from "./CheckBoxTables";

// Validation schema using Zod
const schema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    name: z.string(),
  })
  .superRefine(({ password }, ctx) => {
    if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least 1 letter and 1 number",
      });
    }
  });

type ValidationSchemaType = WaiterData;

interface WaiterFormProps {
  closeModal: () => void;
  waiter?: WaiterData;
}

export default function WaiterForm({ closeModal, waiter }: WaiterFormProps) {
  const editor = useRef(null);
  const [file, setFile] = useState<File | string>(waiter?.photoUrl || "");
  const [tables, setTables] = useState<string[]>(waiter?.tables || []);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const queryClient = useQueryClient();

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ValidationSchemaType>({
    resolver: zodResolver(schema),
  });

  // Prefill form fields when editing
  useEffect(() => {
    if (waiter) {
      setValue("name", waiter.name);
      setValue("username", waiter.username);
      setValue("password", waiter.password);
    }
  }, [waiter, setValue]);

  // Mutation for creating/updating waiter
  const mutation = useMutation({
    mutationFn: async (data: WaiterData) => {
      const s3url = await handleImageUpload();
      const method = waiter ? "patch" : "post";
      const endpoint = waiter ? `waiter/${waiter.id}` : "waiter";

      const postData = await api({
        url: endpoint,
        method,
        data: {
          ...data,
          ...(s3url && { photoUrl: s3url }),
          restaurantId: restaurant.id,
          tables,
        },
      });
      return postData.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiters"] });
      closeModal();
    },
  });

  // Mutation for deleting waiter
  const deleteMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      if (!id) return;
      await api({
        url: `waiter/${id}`,
        method: "delete",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiters"] });
      closeModal();
    },
  });

  const handleImageUpload = async () => {
    if (!file || typeof file === "string") return "";

    const url = await getS3URL();
    // @ts-ignore
    const imageData = editor.current?.getImage()?.toDataURL("image/png");
    const imageBuffer = Buffer.from(
      imageData.replace(/^data:image\/\w+;base64,/, ""),
      "base64",
    );

    const uploaded = await axios.put(url, imageBuffer, {
      headers: { "Content-Type": "image/*" },
    });

    if (uploaded.status !== 200) {
      throw new Error("Unexpected error happened during image upload");
    }

    return url.replace(/\?(.*)/g, "");
  };

  const onSubmit: SubmitHandler<ValidationSchemaType> = (data) => {
    mutation.mutate(data);
  };

  // Query for fetching floors
  const { data: floors, isLoading } = useQuery<FloorData[]>({
    queryKey: ["floors"],
    queryFn: async () => {
      const response = await api.get("/floor?tables=true");
      return response.data;
    },
    refetchIntervalInBackground: false,
  });

  return (
    <div className="mx-[45px] mt-16 text-primary">
      <LoadingModal isOpen={mutation.isPending} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <input
          autoComplete="off"
          name="hidden"
          type="text"
          className="hidden"
        />
        {/* Image Selector */}
        <ImageSelector file={file} setFile={setFile} editor={editor} />

        {/* Form Errors */}
        <FormErrors mutation={mutation} />

        {/* Waiter Name */}
        <FieldHeader>Waiter Name</FieldHeader>
        <InputField register={register} name="name" />
        {errors.name && (
          <ErrorText message={(errors.name as FieldError)?.message || ""} />
        )}

        {/* Waiter Username */}
        <FieldHeader>Waiter Username</FieldHeader>
        <InputField register={register} name="username" />
        {errors.username && (
          <ErrorText message={(errors.username as FieldError)?.message || ""} />
        )}

        <FieldHeader>Waiter Password</FieldHeader>
        <InputField
          register={register}
          name="password"
          type="password"
          autoComplete="new-password"
        />
        {errors.password && (
          <ErrorText message={(errors.password as FieldError)?.message || ""} />
        )}

        <br />
        <Divider />

        {/* Tables */}
        <FieldHeader>Tables</FieldHeader>
        {isLoading ? (
          <Loading />
        ) : (
          floors && (
            <FloorAccordion
              floors={floors}
              tables={tables}
              setTables={setTables}
            />
          )
        )}

        {/* Save/Cancel Buttons */}
        <SaveCancelButtons
          closeModal={closeModal}
          editMode={!!waiter}
          onDelete={() => deleteMutation.mutate(waiter?.id)}
        />
      </form>
    </div>
  );
}

// Helper components for better readability
function ErrorText({ message }: { message: string }) {
  return <p className="text-xl font-bold text-red-500">* {message}</p>;
}

function FloorAccordion({
  floors,
  tables,
  setTables,
}: {
  floors: FloorData[];
  tables: string[];
  setTables: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <Accordion selectionMode="multiple">
      {floors.map((floor) => (
        <AccordionItem
          key={floor.id}
          title={`Floor ${floor.number}`}
          aria-label={`Accordion ${floor.number}`}
        >
          <CheckBoxTables
            data={floor}
            tables={tables}
            setTables={setTables}
            key={floor.id}
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
