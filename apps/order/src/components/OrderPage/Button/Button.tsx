"use client";

import Image from "next/image";
import type { HTMLAttributes } from "react";
import React from "react";

import style from "./Button.module.css";

interface Props extends HTMLAttributes<HTMLElement> {
  name: string;
  imageName: string;
}

export default function Button({
  name,
  imageName,
  ...props
}: Props): JSX.Element {
  return (
    <div className={style.btn} {...props}>
      <div className={style.image}>
        <Image
          src={`/order/images/${imageName}.svg`}
          alt={name}
          height={90}
          width={90}
        />
      </div>

      <p className={style.btn_text}>{name}</p>
    </div>
  );
}
