import "./globals.css";

import { Poppins } from "next/font/google";

import NavBar from "@/components/Menu/NavBar/NavBar";

import StyledComponentsRegistry from "./register";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--poppins-font",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
});

// const poppins = localFont({
//   src: [
//     {
//       path: "../../../../../../public/fonts/Poppins-Thin.ttf",
//       weight: "100",
//     },
//     {
//       path: "../../../../../../public/fonts/Poppins-ExtraLight.ttf",
//       weight: "200",
//     },
//     {
//       path: "../../../../../../public/fonts/Poppins-Light.ttf",
//       weight: "300",
//     },
//     {
//       path: "../../../../../../public/fonts/Poppins-Regular.ttf",
//       weight: "400",
//     },
//     {
//       path: "../../../../../../public/fonts/Poppins-Medium.ttf",
//       weight: "500",
//     },
//     {
//       path: "../../../../../../public/fonts/Poppins-SemiBold.ttf",
//       weight: "600",
//     },
//     {
//       path: "../../../../../../public/fonts/Poppins-Bold.ttf",
//       weight: "700",
//     },
//     {
//       path: "../../../../../../public/fonts/Poppins-ExtraBold.ttf",
//       weight: "800",
//     },
//     {
//       path: "../../../../../../public/fonts/Poppins-Black.ttf",
//       weight: "900",
//     },
//   ],
//   variable: "--font-poppins",
// });

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={poppins.className}>
      <StyledComponentsRegistry>
        <div>{children}</div>
        <NavBar />
      </StyledComponentsRegistry>
    </div>
  );
}
