"use client";

// eslint-disable-next-line import/no-extraneous-dependencies
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FieldError } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { SignInFormData, ValidSignInFieldNames } from "types";

import { SignInUserSchema } from "@/validations/auth";

import SignInFormField from "./SignInFormField";

function FormContainer({
  children,
  error,
}: {
  children: React.ReactNode;
  error: FieldError | undefined;
}) {
  return (
    <div className="w-full">
      <div className="flex h-8 w-full flex-row-reverse items-center justify-end gap-x-[6px]">
        {children}
      </div>
      <hr className=" block w-full border-solid border-primary" />
      {error && <span className=" text-red-600">{error.message} </span>}
    </div>
  );
}

export default function SingUpForm({ text }: { text: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInUserSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const fetchApi = await fetch(
        `${process.env.NEXT_PUBLIC_API}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const response = await fetchApi.json();

      if (!response.success) {
        const fields: ValidSignInFieldNames[] = ["email", "password"];

        response.errors.forEach(
          (error: { message: string; type: ValidSignInFieldNames }) => {
            if (fields.includes(error.type)) {
              // @ts-ignore
              setError(error.type, {
                type: "server",
                message: error.message,
              });
            }
          },
        );
      }

      localStorage.setItem("token", response.tokens.access.token);
      localStorage.setItem("refreshToken", response.tokens.refresh.token);

      router.push("/");
    } catch (e: any) {
      // eslint-disable-next-line no-alert
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center justify-start  gap-y-14">
        <FormContainer error={errors.email}>
          <SignInFormField
            type="email"
            placeholder="example@mail.com"
            name="email"
            register={register}
            error={errors.email}
          />
          <Image src="/EmailIcon.svg" alt="Email Icon" width={26} height={26} />
        </FormContainer>

        <FormContainer error={errors.password}>
          <SignInFormField
            type="password"
            placeholder="Password"
            name="password"
            register={register}
            error={errors.password}
          />
          <Image
            src="/PasswordIcon.svg"
            alt="Email Icon"
            width={26}
            height={26}
          />
        </FormContainer>

        <button
          type="submit"
          className=" mt-2 h-12  w-full  rounded-[10px] bg-primary text-xl font-bold text-white1"
        >
          {text}
        </button>
      </div>
    </form>
  );
}
