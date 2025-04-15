import React from "react";

import Categories from "@/components/Menu/Categories/Categories";
import { Items } from "@/components/Menu/Items/Items";
import TopBanner from "@/components/Menu/TopBanner/page";

export default function Menu() {
  return (
    <>
      <TopBanner />
      <div className="relative mx-4 mt-[3px] overflow-visible">
        <div className="relative">
          <Categories />
          <Items />
        </div>
      </div>
    </>
  );
}
