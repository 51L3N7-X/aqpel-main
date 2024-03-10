"use client";

import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
// import { useRouter } from "next/navigation";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API}`,
});

// const router = useRouter();

createAuthRefreshInterceptor(api, async (failedRequest) => {
  if (
    !localStorage.getItem("token") ||
    !localStorage.getItem("refreshToken") ||
    failedRequest.response.data.message.toLowerCase().includes("expired")
  ) {
    localStorage.clear();
    return Promise.reject(new Error("redirect"));
  }
  const refreshToken = localStorage.getItem("refreshToken") as string;
  const { data } = await api.post(
    `${process.env.NEXT_PUBLIC_API}/auth/refresh-tokens`,
    {
      refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  // eslint-disable-next-line no-console
  localStorage.setItem("token", data.access.token);
  localStorage.setItem("refreshToken", data.refresh.token);
  // eslint-disable-next-line no-param-reassign
  failedRequest.response.config.headers.Authorization = data.access.token;
  return Promise.resolve();
});

export default api;
