"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import CartIcon from "@/public/menu/cartIcon.svg";
import Chicken from "@/public/menu/chicken.svg";
import HeartIcon from "@/public/menu/heartIcon.svg";
import HomeIcon from "@/public/menu/home.svg";

import { NavLink } from "../NavLink/NavLink";

export default function NavBar() {
  const [firstPathName, setFirstPathName] = useState("");
  const pathname = usePathname();
  useEffect(() => {
    setFirstPathName(pathname);
  }, [pathname]);
  return (
    <div className="navbar fixed bottom-2 left-0 z-50 mx-[1%] w-[98%] rounded-3xl shadow-[0_-2px_3px_0_rgba(190,190,0.10)_inset_0_4px_4px_0_rgba(0,0,0.25)]">
      <div className="relative flex w-full justify-between">
        {/* eslint-disable-next-line */}
        <div className="left my-[18px] flex w-1/3  justify-around">
          <NavLink
            exact
            href={firstPathName.substring(0, pathname.lastIndexOf("/"))}
          >
            <HomeIcon />
          </NavLink>
          <NavLink exact href={firstPathName}>
            <Chicken />
          </NavLink>
        </div>
        <div className="logo absolute left-1/2 flex -translate-x-1/2 items-center justify-center bg-yellow1">
          <div className="relative mr-2 size-[80%]">
            <Image src="/menu/waiterIcon.svg" fill alt="Call Waiter" />
          </div>
        </div>
        {/* eslint-disable-next-line */}
        <div className="right my-[18px] flex w-1/3 justify-around">
          <NavLink exact href={`${firstPathName}/favourites`}>
            <HeartIcon />
          </NavLink>
          <NavLink exact href={`${firstPathName}/cart`}>
            <CartIcon />
          </NavLink>
        </div>
      </div>
    </div>
  );
}
