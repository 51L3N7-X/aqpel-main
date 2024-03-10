"use client";

import { Suspense, useEffect, useState } from "react";

import ItemPage from "./itemPage";

export default function Page({ params }: { params: { itemId: string } }) {
  const [data, setData] = useState({});
  const [isExist, setIsExist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/item/${params.itemId}`,
      );
      if (!(response.status >= 200 && response.status <= 400)) {
        return setIsExist(false);
      }
      const json = await response.json();
      setIsExist(true);
      setData(json);
      return json;
    };

    fetchData();
  }, [params.itemId]);

  return (
    <Suspense fallback={<div>Loading ...</div>}>
      {isExist && (
        /* @ts-ignore */
        <ItemPage item={data} />
      )}
    </Suspense>
  );
}
