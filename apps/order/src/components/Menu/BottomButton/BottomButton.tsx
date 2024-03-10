import React from "react";

export default function BottomButton({
  title,
  Icon,
  onClick,
}: {
  title: string;
  Icon?: React.ReactNode;
  onClick?: () => any;
}) {
  return (
    <div
      aria-hidden="true"
      className="fixed bottom-[17vh] right-1/2 block min-w-max translate-x-1/2 rounded-[20px] bg-yellow1 px-[28px] py-[10px]"
      onClick={onClick}
    >
      <div className="inline-flex w-auto items-center justify-center gap-4">
        {Icon}
        <p className="text-[20px] font-semibold text-white1">{title}</p>
      </div>
    </div>
  );
}
