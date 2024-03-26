"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import api from "@/lib/axios";

export const fetchApi = ({
  url,
  method,
  router,
  token,
  params,
  data,
}: {
  url: string;
  method: string;
  router: AppRouterInstance;
  token: string;
  params?: any;
  data?: any;
}) =>
  api({
    headers: {
      Authorization: token,
    },
    url,
    method,
    data,
    params,
  })
    .then((res) => res.data)
    .catch((error: any) => {
      if (error.message === "redirect") {
        localStorage.clear();
        router.push("/signin");
      }
      throw error;
    });
