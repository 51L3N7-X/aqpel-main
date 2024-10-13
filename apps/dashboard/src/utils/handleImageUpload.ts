import axios from "axios";

import { getS3URL } from "./getS3URL";

export const handleImageUpload = async (file: string | File, editor: any) => {
  if (!file || typeof file === "string") return "";

  const url = await getS3URL();
  // @ts-ignore
  const imageData = editor.current?.getImage()?.toDataURL("image/png");
  const imageBuffer = Buffer.from(
    imageData.replace(/^data:image\/\w+;base64,/, ""),
    "base64",
  );

  const uploaded = await axios.put(url, imageBuffer, {
    headers: { "Content-Type": "image/*" },
  });

  if (uploaded.status !== 200) {
    throw new Error("Unexpected error happened during image upload");
  }

  return url.replace(/\?(.*)/g, "");
};
