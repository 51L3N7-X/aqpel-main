"use client";

import Image from "next/image";
import type { HTMLAttributes, ReactElement, SVGProps } from "react";
import React from "react";
import { Camera, LucideProps } from "lucide-react";

import style from "./Button.module.css";

interface Props extends HTMLAttributes<HTMLElement> {
  name: string;
  children: ReactElement<SVGProps<SVGElement>>;
}

export default function LucideButton({
  name,
  children,
  ...props
}: Props): JSX.Element {
  return (
    <div className={style.btn} {...props}>
      <div className={style.image}>{children}</div>

      <p className={style.btn_text}>{name}</p>
    </div>
  );
}
