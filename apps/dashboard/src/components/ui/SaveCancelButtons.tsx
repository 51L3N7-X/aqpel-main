import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import DialogComponent from "./Dialog";

export default function SaveCancelButtons({
  closeModal,
  editMode = true,
  onDelete,
}: {
  closeModal: () => any;
  editMode?: boolean;
  onDelete?: () => any;
}) {
  const [isopen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };
  return (
    <div className="mb-14 mt-[84px] flex w-full justify-between">
      <button
        type="submit"
        aria-hidden
        className=" flex h-11 w-[220px] cursor-pointer items-center justify-center rounded-[10px] bg-primary text-white1 outline-none"
      >
        <p className="text-2xl">Save</p>
      </button>
      <button
        onClick={closeModal}
        type="button"
        aria-hidden
        className="flex h-11 w-[220px] cursor-pointer items-center justify-center rounded-[10px] border border-primary"
      >
        <p className="text-2xl  font-bold text-primary">Cancel</p>
      </button>
      {editMode && (
        <Trash2
          size={44}
          className="cursor-pointer rounded-[10px] border-2 border-primary"
          onClick={() => setIsOpen(true)}
        />
      )}
      <DialogComponent isOpen={isopen} onClose={closeDialog}>
        <div className="flex flex-col items-center justify-center p-6">
          <Image
            src="/Delete.svg"
            width={86}
            height={86}
            alt="delete"
            className="mb-10"
          />
          <h1 className="mb-16 w-[360px] text-center text-3xl font-bold text-delete">
            Are you sure you want to delete?
          </h1>
          <div className=" mb-2 space-x-4">
            <button
              type="button"
              className="h-11 w-44 rounded-[10px] bg-delete text-xl  font-bold text-white"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              className="h-11 w-44 rounded-[10px] border border-delete text-xl font-bold text-delete"
              type="button"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </DialogComponent>
    </div>
  );
}
