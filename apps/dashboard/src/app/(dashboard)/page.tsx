"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { useUserStore } from "@/stores/user";
import { fetchApi } from "@/utils/fetchApi";

export const revalidate = 1800;

export default function Page() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    const user = fetchApi({
      url: "/user",
      method: "get",
      router,
      token: localStorage.getItem("token")!,
    });
    setUser(user);
  }, [setUser, router]);
  return <section />;
}
