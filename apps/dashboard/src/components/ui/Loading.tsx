/* eslint-disable react/jsx-wrap-multilines */
import { CircularProgress } from "@nextui-org/react";
import React from "react";

export default function Loading({ text }: { text?: string }) {
  return (
    <div className="flex size-full items-center justify-center">
      <CircularProgress
        label={
          <h1 className="text-lg font-bold text-primary">
            {text || "Loading..."}
          </h1>
        }
        size="lg"
      />
    </div>
  );
}
