import "./globals.css";

import { Nunito } from "next/font/google";
import React from "react";

const nunito = Nunito({
  variable: "--nunito-font",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.className}>
      <body className=" min-h-[100dvh]">{children}</body>
    </html>
  );
}
