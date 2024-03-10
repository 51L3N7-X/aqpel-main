"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import React from "react";

import styles from "./Loading.module.css";

export default function Loading({ name, style }: { name: string; style: {} }) {
  return (
    <div style={style} className={styles.container}>
      <Player
        autoplay
        loop
        src="https://assets7.lottiefiles.com/packages/lf20_0wpcfi5y.json"
        style={{ height: "500px", width: "500px" }}
      />
      <p className={styles.loading_text}>Calling The {name}</p>
      <button className={styles.btn} type="button">
        Cancel calling
      </button>
    </div>
  );
}
