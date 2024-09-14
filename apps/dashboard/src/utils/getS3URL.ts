import api from "@/lib/api";

export const getS3URL = async (): Promise<string> => {
  const requestURL = await api({
    url: "/user/getUploadURL",
    method: "get",
    params: { fileExtension: "png" },
  });
  return requestURL.data.url;
};
