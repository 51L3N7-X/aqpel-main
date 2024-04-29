// import type { Config } from "tailwindcss";

// const config: Config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     fontFamily: {
//       poppins: "var(--poppins-font)",
//     },
//     extend: {
//       colors: {
//         text: "#313638",
//         black1: "#1B1E21",
//         yellow1: "#FFCC36",
//         white2: "#FBFAF6",
//         white1: "#FDFDFD",
//         gray1: "rgba(49,54,56,0.77)",
//       },
//       // backgroundImage: {
//       //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//       //   "gradient-conic":
//       //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//       // },
//     },
//     // colors: {
//     // text: "#313638",
//     // black1: "#1B1E21",
//     // yellow1: "#FFCC36",
//     // white2: "#FBFAF6",
//     // white1: "#FDFDFD",
//     // },
//   },
//   plugins: [],
// };
// export default config;

// tailwind config is required for editor support

import sharedConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "content" | "presets" | "theme"> = {
  content: ["./src/app/**/*.tsx", "./src/components/**/*.tsx"],
  theme: {
    fontFamily: {
      poppins: "var(--poppins-font)",
    },
    extend: {
      colors: {
        text: "#313638",
        black1: "#1B1E21",
        yellow1: "#FFCC36",
        white2: "#FBFAF6",
        white1: "#FDFDFD",
        gray1: "rgba(49,54,56,0.77)",
      },
    },
  },
  presets: [sharedConfig],
};

export default config;
