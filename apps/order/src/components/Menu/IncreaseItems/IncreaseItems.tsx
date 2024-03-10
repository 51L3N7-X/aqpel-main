"use client";

// import type { ItemData } from "@repo/types";
import type { Dispatch } from "react";
import React from "react";

import type { CartItem } from "@/utils/cart";

import DecreaseIcon from "../icons/decrease.svg";
import IncreaseIcon from "../icons/increase.svg";

export default function IncreaseItems({
  // item,
  // tempCart: tempCartItem,
  setTempCart,
  number,
  setNumber,
}: {
  // item: ItemData;
  // tempCart: (obj: CartItem) => CartItem;
  setTempCart: Dispatch<(obj: CartItem) => CartItem>;
  number: number;
  setNumber: Dispatch<(number: any) => any>;
}) {
  const increaseNumber = () => {
    if (number === 99) return;
    setNumber((number1) => number1 + 1);
    setTempCart((obj: CartItem) => ({
      ...obj,
      quanity: number + 1,
    }));
  };

  const decreaseNumber = () => {
    if (number === 1) return;
    setNumber((number1) => number1 - 1);
    setTempCart((obj: CartItem) => ({
      ...obj,
      quanity: number - 1,
    }));
  };

  return (
    <div className="relative h-9 w-32 rounded-2xl bg-yellow1">
      <div className="flex size-full items-center justify-center">
        <p className="select-none text-lg font-semibold text-white1">
          {number}
        </p>
      </div>
      <div
        aria-hidden
        className="absolute  right-[-1%] top-0 flex size-9 cursor-pointer items-center justify-center rounded-full bg-yellow1 shadow-[0px_1px_4px_0px_rgba(167,167,167,0.25)] active:select-none"
        onClick={increaseNumber}
      >
        <IncreaseIcon />
      </div>
      <div
        aria-hidden
        className="absolute left-[-1%] top-0 flex size-9 cursor-pointer items-center justify-center rounded-full bg-yellow1 shadow-[0px_1px_4px_0px_rgba(167,167,167,0.25)]"
        onClick={decreaseNumber}
      >
        <DecreaseIcon />
      </div>
    </div>
  );
}
