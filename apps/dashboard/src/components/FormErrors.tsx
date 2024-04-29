import type { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";

export default function FormErrors({
  mutation,
}: {
  mutation: UseMutationResult<any, Error, any, unknown>;
}) {
  return (
    mutation.error instanceof AxiosError &&
    ((mutation.error?.response?.data?.errors?.length &&
      mutation.error.response.data.errors.map((error: { message: string }) => (
        <p className="text-xl font-bold text-red-500" key={error.message}>
          * {error.message}
        </p>
      ))) ||
      (mutation.error?.response?.data?.message && (
        <p className="text-xl font-bold text-red-500">
          {mutation.error.response.data.message}
        </p>
      )) || (
        <p className="text-xl font-bold text-red-500">
          * {mutation.error.message}
        </p>
      ))
  );
}
