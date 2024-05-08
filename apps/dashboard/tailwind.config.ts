// tailwind config is required for editor support

import { nextui } from "@nextui-org/theme";
import sharedConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<
  Config,
  "content" | "presets" | "theme" | "darkMode" | "plugins"
> = {
  content: [
    "./src/app/**/*.tsx",
    "./src/components/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [sharedConfig],
  theme: {
    extend: {
      fontFamily: {
        nunito: "var(--nunito-font)",
        mrk: "var(--mrk-font)",
      },
      boxShadow: {
        fi: "inset -1px -2px 3.7px -1.5px rgb(0 0 0 / 0.5), 0 5px 11.6px -2px rgb(0 0 0 / 0.1), -4px -4px 3.8px 0 rgb(198 198 198 / 0.05)",
        item: "0 4px 16px -3px rgb(0 0 0 / 0.17), -4px 0px 18px -4px rgb(255 255 255 / 0.73)",
      },
      colors: {
        white1: "#FDFDFD",
        primary: "#0098AA",
        secondary: "#46B5C2",
        delete: "#D23D3D",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;
