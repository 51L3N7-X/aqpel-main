import React from "react";

export default function ReplaceRemoveButtons({
  onReplace,
  onCancel,
}: {
  onReplace: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mx-auto mb-5 flex max-w-[382px] flex-row space-x-[14px]">
      <div
        className=" flex h-11 w-[184px] cursor-pointer items-center justify-center rounded-[10px] bg-primary text-[22px] font-bold text-white1"
        onClick={onReplace}
        aria-hidden
      >
        Replace
      </div>
      <div
        className="flex h-11 w-[184px] cursor-pointer items-center  justify-center rounded-[10px] border border-primary text-[22px] font-bold text-primary"
        onClick={onCancel}
        aria-hidden
      >
        Remove
      </div>
    </div>
  );
}
