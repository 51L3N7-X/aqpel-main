"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import api from "@/lib/api";
import { useUserStore } from "@/stores/user";

// export const revalidate = 1800;

export default function Page() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    const user = api({
      url: "/user",
      method: "get",
    });
    setUser(user);
  }, [setUser, router]);
  return <section />;
}
