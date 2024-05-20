/* eslint-disable max-len */
import { Dialog } from "@headlessui/react";
import { CircularProgress } from "@nextui-org/react";
import React from "react";

export default function LoadingModal({
  isOpen,
  text = "Uploading...",
}: {
  isOpen: boolean;
  text?: string;
}) {
  return (
    <Dialog className="relative z-[999]" open={isOpen} onClose={() => true}>
      <div className="fixed inset-0 bg-black/30 blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <Dialog.Panel className="flex w-full max-w-sm items-center justify-center rounded bg-transparent">
          <CircularProgress
            label={<h1 className=" text-lg font-bold text-primary">{text}</h1>}
            size="lg"
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
