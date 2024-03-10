"use client";

import React, { useEffect, useState } from "react";

import { CartStore } from "@/utils/cart";

export default function TotalPrice() {
  const [price, setTotalPrice] = useState(0);

  useEffect(() => {
    const cart = new CartStore();
    setTotalPrice(cart.getTotalPrice());
  }, []);
  return (
    <div className="fixed bottom-[25vh] right-1/2 flex min-w-[90%] translate-x-1/2 items-center justify-between">
      <p className="text-[22px] font-medium text-text">Total Price:</p>
      <h1 className="text-[22px] font-semibold text-yellow1">{price}</h1>
    </div>
  );
}
