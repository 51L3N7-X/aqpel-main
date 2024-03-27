"use client";

// eslint-disable-next-line import/no-extraneous-dependencies
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FieldError } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { SignUpFormData, ValidSignUpFieldNames } from "types";

// import EmailIcon from "@/public/EmailIcon.svg";
// import PasswordIcon from "@/public/PasswordIcon.svg";
// import UserIcon from "@/public/UserIcon.svg";
import { SignUpUserSchema } from "@/validations/auth";

import SignUpFormField from "./SignUpFormField";

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
      {error && <span className=" text-red-600">{error.message}</span>}
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
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpUserSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const fetchApi = await fetch(
        `${process.env.NEXT_PUBLIC_API}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const response = await fetchApi.json();

      if (!response.success) {
        const fields: ValidSignUpFieldNames[] = [
          "email",
          "username",
          "password",
        ];

        return response.errors.forEach(
          (error: { message: string; type: ValidSignUpFieldNames }) => {
            if (fields.includes(error.type)) {
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

      return router.push("/");
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center justify-start  gap-y-14">
        <FormContainer error={errors.email}>
          <SignUpFormField
            type="email"
            placeholder="example@mail.com"
            name="email"
            register={register}
            error={errors.email}
          />
          <Image src="/EmailIcon.svg" alt="email icon" width={26} height={26} />
        </FormContainer>

        <FormContainer error={errors.username}>
          <SignUpFormField
            type="username"
            placeholder="Username"
            name="username"
            register={register}
            error={errors.username}
          />
          <Image src="/UserIcon.svg" alt="user icon" width={26} height={26} />
        </FormContainer>

        <FormContainer error={errors.password}>
          <SignUpFormField
            type="password"
            placeholder="Password"
            name="password"
            register={register}
            error={errors.password}
          />
          <Image
            src="/PasswordIcon.svg"
            alt="user icon"
            width={26}
            height={26}
          />
        </FormContainer>

        <button
          type="submit"
          className=" mt-2 h-12 w-full rounded-[10px] bg-primary text-xl font-bold text-white1"
        >
          {text}
        </button>
      </div>
    </form>
  );
}
