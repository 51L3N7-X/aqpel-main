export interface Order {
  // from user is waiter or bill or embers
  type: string | "embers" | "waiter" | "bill" | "order" | "kitchen";
  restaurant_id: string;
  table_id: string | string[];
  order_deatils: {
    price: string;
    payment_method: string;
    items: [
      {
        name: string;
        count: number | string;
        image_url: string;
      }
    ];
  };
  done: boolean;
}
