"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import api from "@/lib/axios";

export const fetchApi = (
  url: string,
  router: AppRouterInstance,
  token: string,
) =>
  api
    .get(url, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => res.data)
    .catch((error: any) => {
      if (error.message === "redirect") {
        router.push("/signin");
      }
    });
