"use client";

// import type { Dispatch } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Accordion, AccordionItem, Checkbox, Divider } from "@nextui-org/react";
import type { FloorData, TableItems, WaiterData } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import type { FieldError, SubmitHandler } from "react-hook-form";
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
import LoadingModal from "../ui/LoadingModal";
import SaveCancelButtons from "../ui/SaveCancelButtons";

const CheckBoxTables = ({
  data,
  key,
  tables,
  setTables,
}: {
  data: FloorData;
  key: any;
  tables: any;
  setTables: any;
}) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  return (
    <div className=" overflow-hidden">
      <Checkbox
        onChange={(e) => {
          const ids = data.tables.map((table) => table.id);
          setCheckedItems(e.target.checked ? ids : []);
          if (e.target.checked) {
            setTables([...tables, ...ids]);
          } else {
            setTables(tables.filter((id: any) => !ids.includes(id)));
          }
        }}
        key={key}
      >
        Select all
      </Checkbox>
      <Divider />
      <br />
      {/* <CheckboxGroup orientation="horizontal"> */}
      {data.tables.map((table: TableItems) => (
        <Checkbox
          value={table.id}
          // checked={checkedItems.includes(table.id)}
          isSelected={checkedItems.includes(table.id)}
          // onChange={(e) => {
          //   if (tables.includes(e.target.value)) {
          //     return setTables(
          //       tables.filter((table) => table !== e.target.value),
          //     );
          //   }
          //   return setTables([...tables, e.target.value]);
          // }}
          onChange={(event) => {
            const newCheckedItems = [...checkedItems];
            let newTables = [...tables, event.target.value];
            if (tables.includes(event.target.value)) {
              newTables = newTables.filter(
                (dasTable) => dasTable !== event.target.value,
              );
            }
            if (event.target.checked) {
              newCheckedItems.push(table.id);
            } else {
              newCheckedItems.splice(newCheckedItems.indexOf(table.id), 1);
            }
            setCheckedItems(newCheckedItems);
            setTables(newTables);
          }}
        >
          {table.number}
        </Checkbox>
      ))}
      {/* </CheckboxGroup> */}
    </div>
  );
};

export default function NewWaiterForm({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const editor = useRef(null);
  const [file, setFile] = useState<File | string>("");
  const [tables, setTables] = useState<string[]>([]);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const router = useRouter();

  const schema = z
    .object({
      username: z.string().min(3),
      password: z.string().min(8),
      name: z.string(),
      //   active: z.boolean(),
    })
    .superRefine(({ password }, ctx) => {
      if (password.length < 8) {
        ctx.addIssue({
          code: "custom",
          message: "password must be at lease 8 characters",
        });
      }
      if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
        ctx.addIssue({
          code: "custom",
          message: "password must contain at least 1 letter and 1 number",
        });
      }
    });

  type ValidationSchemaType = WaiterData;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: WaiterData) => {
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
        url: `waiter`,
        method: "post",
        data: {
          ...data,
          ...(s3url && { photoUrl: s3url }),
          restaurantId: restaurant.id,
          ...(Object.keys(tables).length && { tables }),
        },
        token: localStorage.getItem("token")!,
        router,
      });
      return postData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiters"] });
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

  const { isLoading, data: floors } = useQuery({
    queryKey: ["floors"],
    queryFn: async (): Promise<FloorData[]> => {
      try {
        const data = await fetchApi({
          url: `/floor?tables=true`,
          method: "get",
          router,
          token: localStorage.getItem("token")!,
        });
        return data;
      } catch (e: any) {
        if (e.response.data.code === 404) return [];
        throw e;
      }
    },
    refetchIntervalInBackground: false,
  });

  return (
    <div className="mx-[45px] mt-16 text-primary">
      <LoadingModal isOpen={mutation.isPending} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ImageSelector file={file} setFile={setFile} editor={editor} />
        <FormErrors mutation={mutation} />
        <FieldHeader>Waiter name</FieldHeader>
        <InputField register={register} name="name" />
        {errors.name && (
          <p className="text-xl font-bold text-red-500">
            * {(errors.name as FieldError).message}
          </p>
        )}
        <FieldHeader>Waiter username</FieldHeader>
        <InputField register={register} name="username" />
        {errors.username && (
          <p className="text-xl font-bold text-red-500">
            * {(errors.username as FieldError).message}
          </p>
        )}
        <FieldHeader>Waiter password</FieldHeader>
        <InputField register={register} name="password" type="password" />
        {errors.password && (
          <p className="text-xl font-bold text-red-500">
            * {(errors.password as FieldError).message}
          </p>
        )}
        <br />
        <Divider />
        <FieldHeader>Tables</FieldHeader>

        {isLoading ? (
          <Loading />
        ) : (
          floors && (
            <Accordion selectionMode="multiple">
              {floors?.map((floor) => (
                <AccordionItem
                  key={floor.id}
                  title={`Floor ${floor.number}`}
                  aria-label={`Accordion ${floor.number}`}
                >
                  <CheckBoxTables
                    data={floor}
                    key={floor.id}
                    tables={tables}
                    setTables={setTables}
                  />
                </AccordionItem>
              ))}
            </Accordion>
          )
        )}
        <SaveCancelButtons closeModal={closeModal} />
      </form>
    </div>
  );
}
