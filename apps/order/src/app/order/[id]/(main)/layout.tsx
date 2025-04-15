import React from "react";

import "./main.css"
import style from "./imgs.module.css"

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="parent">
      <div className="z-10 relative w-full h-full">{children}</div>
      <div className={style.background} />
      <div className={style.filter}></div>
      <div className={style.overlay} />
    </div>
  );
}
