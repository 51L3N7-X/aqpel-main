"use client";

import React from "react";

import styles from "./Buttons.module.css";

export default function Buttons({
  children,
  style,
}: {
  children: React.ReactNode;
  style: {};
}) {
  return (
    <div style={style} className={styles.container}>
      {children}
    </div>
  );
}
