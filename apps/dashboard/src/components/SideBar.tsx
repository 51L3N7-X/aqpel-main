"use client";

import Image from "next/image";
import type { Dispatch } from "react";
import React from "react";
import styled from "styled-components";

import NavItem from "./NavItem";

const NavItems: {
  text: string;
  href: string;
  iconSrc: string;
}[] = [
  {
    text: "Dashboard",
    href: "/",
    iconSrc: "DashboardIcon",
  },
  {
    text: "Menu",
    href: "/menu",
    iconSrc: "MenuIcon",
  },
  {
    text: "Services",
    href: "/services",
    iconSrc: "ServicesIcon",
  },
  {
    text: "Tables",
    href: "/tables",
    iconSrc: "TableIcon",
  },
  {
    text: "Waiters",
    href: "/waiters",
    iconSrc: "WaiterIcon",
  },
  {
    text: "Kitchen",
    href: "/kitchen",
    iconSrc: "KitchenIcon",
  },
  {
    text: "Reports",
    href: "/reports",
    iconSrc: "ReportsIcon",
  },
  {
    text: "Settings",
    href: "/settings",
    iconSrc: "SettingsIcon",
  },
];

function BarImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      className=" size-12  rounded-full shadow-[0px_0px_0px_9px_rgba(255,255,255,0.22)]"
      width={512}
      height={512}
    />
  );
}

const NavBar = styled.nav<{ $close?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: calc(100% - 3rem);
  width: ${(props) => (props.$close ? "88px" : "254px")};
  background-color: #0098aa;
  z-index: 50;
  transition: all 0.3s ease;
`;

const CloseButton = styled.div<{ $close: boolean }>`
  transform: ${(props) => props.$close && "rotate(180deg)"};
`;

export default function SideBar({
  close,
  setClose,
}: {
  close: boolean;
  setClose: Dispatch<(state: boolean) => boolean>;
}) {
  return (
    <NavBar className="m-6 mr-8 rounded-2xl" $close={close}>
      <header className="my-8 flex flex-row items-center space-x-5 px-5">
        <BarImage src="/restaurantBackground.jpg" alt="Restaurant image" />
        {!close && (
          <h1 className="text-[20px] font-bold leading-6 text-white1">
            Al Sadda Restaurant
          </h1>
        )}
      </header>

      <CloseButton
        className="absolute right-[-16px] top-[88px] z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white1 shadow-md"
        onClick={() => setClose((state: any) => !state)}
        $close={close}
      >
        <Image
          src="/Arrow.svg"
          alt="Arrow"
          width={24}
          height={24}
          style={{ width: "24px", height: "24px" }}
        />
      </CloseButton>

      {NavItems.map((item) => (
        <NavItem
          text={item.text}
          href={item.href}
          IconSrc={item.iconSrc}
          close={close}
          key={item.text}
        />
      ))}

      <footer className=" absolute bottom-[3%] flex flex-row items-center space-x-5 px-5 text-white1">
        <BarImage src="/restaurantBackground.jpg" alt="Restaurant image" />
        {!close && (
          <div>
            <h1 className="text-[20px] font-bold leading-6 text-white1">
              Welcome
            </h1>

            <span className="whitespace-nowrap text-lg font-semibold  leading-6">
              abdullah shaiban
            </span>
          </div>
        )}
      </footer>
    </NavBar>
  );
}
