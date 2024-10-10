"use client";

import React from "react";
import { Tabs } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  return router.push("/settings/user");
}
