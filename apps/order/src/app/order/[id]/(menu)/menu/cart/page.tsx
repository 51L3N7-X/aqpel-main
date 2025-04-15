import React from "react";

import BottomButton from "@/components/Menu/BottomButton/BottomButton";
import HorzItems from "@/components/Menu/HorzItems/HorzItems";
import TopBar from "@/components/Menu/TopBar/TopBar";
import TotalPrice from "@/components/Menu/TotalPrice/TotalPrice";

export default function Cart() {
  return (
    <div className="">
      <TopBar title="Cart" />
      <HorzItems type="cart" />
      <TotalPrice />
      <BottomButton title="Send The Order" />
    </div>
  );
}
