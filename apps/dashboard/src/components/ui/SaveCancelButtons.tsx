import React from "react";

export default function SaveCancelButtons({
  closeModal,
}: {
  closeModal: () => any;
}) {
  return (
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
  );
}
