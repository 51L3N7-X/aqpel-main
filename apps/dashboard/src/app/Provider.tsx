"use client";

import { NextUIProvider } from "@nextui-org/system";
import React from "react";

export function Provider({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
