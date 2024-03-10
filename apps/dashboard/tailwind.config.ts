// tailwind config is required for editor support

import sharedConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "content" | "presets" | "theme"> = {
  content: ["./src/app/**/*.tsx", "./src/components/**/*.tsx"],
  presets: [sharedConfig],
  theme: {
    extend: {
      fontFamily: {
        nunito: "var(--nunito-font)",
      },
      boxShadow: {
        fi: "inset -1px -2px 3.7px -1.5px rgb(0 0 0 / 0.5), 0 5px 11.6px -2px rgb(0 0 0 / 0.1), -4px -4px 3.8px 0 rgb(198 198 198 / 0.05)",
      },
      colors: {
        white1: "#FDFDFD",
        primary: "#0098AA",
        secondary: "#46B5C2",
      },
    },
  },
};

export default config;
