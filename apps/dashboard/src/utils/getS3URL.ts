import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { fetchApi } from "./fetchApi";

export const getS3URL = async (router: AppRouterInstance): Promise<string> => {
  const requestURL = await fetchApi({
    url: "/getUploadURL",
    method: "get",
    token: localStorage.getItem("token")!,
    router,
    params: { fileExtension: "png" },
  });
  return requestURL.url;
};
