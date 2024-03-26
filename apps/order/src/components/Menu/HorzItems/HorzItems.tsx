"use client";

import type { ItemData } from "@repo/types";
import React, { Suspense, useEffect, useState } from "react";

import type { CartItem } from "@/utils/cart";
import { CartStore } from "@/utils/cart";
import { FavStore } from "@/utils/favourites";

import HorzItem from "../HorzItem/HorzItem";

export default function HorzItems({ type }: { type: "cart" | "fav" }) {
  const [cartState, setCart] = useState<CartItem[]>();
  const [fav, setFav] = useState<ItemData[]>();

  useEffect(() => {
    const tempCart = new CartStore();
    const tempFav = new FavStore();
    setCart(tempCart.getAll());
    setFav(tempFav.getAll());
  }, []);

  return (
    <div className="mb-[35vh] flex flex-col gap-6">
      <Suspense fallback={<div>Loading...</div>}>
        {type === "cart"
          ? cartState?.map((cart) => (
              <HorzItem
                name={cart.name}
                price={String(cart.price)}
                key={cart.id}
                count={cart.quanity}
                image="/menu/item.jpg"
              />
            ))
          : fav?.map((favItem) => (
              <HorzItem
                name={favItem.name}
                price={String(favItem.price)}
                key={favItem.id}
                image={favItem.imageUrl}
              />
            ))}
      </Suspense>
    </div>
  );
}
