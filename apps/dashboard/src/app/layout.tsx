import "./globals.css";

import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import React from "react";

const nunito = Nunito({
  variable: "--nunito-font",
  subsets: ["latin"],
});

const MRKFont = localFont({
  src: "../../fonts/mrk/MRKMaston-Regular.woff2",
  display: "swap",
  variable: "--mrk-font",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.className} ${MRKFont.variable}`}>
      <body className=" min-h-[100dvh]">{children}</body>
    </html>
  );
}
