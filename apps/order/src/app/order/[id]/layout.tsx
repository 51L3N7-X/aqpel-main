import React from "react";

import { ReactQueryProvider } from "@/app/ReactQueryProvider";

export default function OrderLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
