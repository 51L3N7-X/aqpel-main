"use client";

import Image from "next/image";
import React from "react";

import style from "./Navbar.module.css";

export default function NavBar() {
  return (
    <nav className={style.nav}>
      <Image src="/order/images/logo.svg" alt="logo" height={44} width={44} />
      <Image
        src="/order/images/burger-menu.svg"
        alt="menu"
        height={44}
        width={44}
      />
    </nav>
  );
}
