import { notFound } from "next/navigation";

import Order from "@/components/OrderPage/Order/Order";

// export const dynamicParams = false;

// export async function generateStaticParams() {
//   return [{ id: "1" }, { id: "2" }];
// }

async function getTable(id: string) {
  // console.log(process.env.NEXT_PUBLIC_API_URL);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${id}`);

  // console.log(res.status);

  if (!(res.status === 200)) return null;

  const response = await res.json();
  // console.log(response);
  // ge
  // if (!response.table) return null;
  if (!response) return null;
  return response;
}

async function getRestaurant(restaurantId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}restaurant/${restaurantId}`,
  );
  if (!(res.status === 200)) return null;

  const response = await res.json();
  if (!response) return null;
  return response;
}

export default async function Page({ params }: { params: { id: string } }) {
  const table = await getTable(params.id);
  if (!table) return notFound();
  const restaurant = await getRestaurant(table.restaurantId);
  if (!restaurant) return notFound();
  return <Order params={params} table={table} restaurant={restaurant} />;
}
