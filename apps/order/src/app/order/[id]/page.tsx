import { notFound } from "next/navigation";

import Order from "@/components/OrderPage/Order/Order";

// export const dynamicParams = false;

// export async function generateStaticParams() {
//   return [{ id: "1" }, { id: "2" }];
// }

async function getData(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${id}`);

  console.log(res.status);

  if (!(res.status === 200)) return null;

  const response = await res.json();
  // ge
  // if (response.table == null) return null;
  if (!response) return null;
  return response;
}

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getData(params.id);
  console.log(data);
  if (!data) return notFound();
  return <Order params={params} table={data.table} />;
}
