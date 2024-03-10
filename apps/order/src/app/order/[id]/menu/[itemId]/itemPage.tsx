"use client";

import type { ItemData } from "@repo/types";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";

import Alert from "@/components/Menu/Alert/Alert";
import BottomButton from "@/components/Menu/BottomButton/BottomButton";
import ItemsTextsContainer from "@/components/Menu/itemTextsContainer/ItemsTextsContainer";
import ItemTopBar from "@/components/Menu/ItemTopBar/ItemTopBar";
import Cart from "@/public/menu/cartIcon.svg";
import FilledHeart from "@/public/menu/filledHeart.svg";

import type { CartItem } from "../../../../../utils/cart";
import { CartStore } from "../../../../../utils/cart";

export default function ItemPage({ item }: { item: ItemData }) {
  const [cartClicked, setCartClicked] = useState(false);

  const [likeClicked, setLikeClicked] = useState(false);

  const [number, setNumber] = useState(1);

  const initialState = {
    name: item.name,
    price: +item.price,
    quanity: number,
    id: item.id,
    image: item.imageUrl,
  };

  const [tempCartItem, setTempCartItem] = useState<(obj: CartItem) => CartItem>(
    () => initialState,
  );

  const onClickAddToCart = () => {
    const cart = new CartStore();
    // @ts-ignore
    cart.addItem(tempCartItem);

    setNumber(() => 1);
    setTempCartItem(() => initialState);
    setCartClicked(true);
    setTimeout(() => {
      setCartClicked(false);
    }, 1500);
  };

  return (
    <>
      <ItemTopBar
        item={item}
        // tempCart={tempCartItem}
        setTempCart={setTempCartItem}
        number={number}
        setNumber={setNumber}
        setLikeClicked={setLikeClicked}
      />
      <ItemsTextsContainer item={item} />
      <AnimatePresence>
        {cartClicked && (
          <Alert
            title="Added To Cart"
            Icon={<Cart style={{ fill: "white" }} />}
          />
        )}
        {likeClicked && (
          <Alert title="Added To Favourites" Icon={<FilledHeart />} />
        )}
      </AnimatePresence>
      <BottomButton
        title="Add to cart"
        Icon={<Cart style={{ fill: "white" }} />}
        onClick={onClickAddToCart}
      />
    </>
  );
}
