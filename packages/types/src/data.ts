export type ItemArray = Array<ItemData>;

export interface ItemData {
  name: string;
  price: number;
  description?: string;
  calories?: number;
  people?: number;
  new?: boolean;
  special?: boolean;
  imageUrl?: string;
  id: string;
  ingredients?: string;
}

export interface MenuData {
  name: string | any;
  id: string;
  imageUrl: string;
}

export interface CategoryData {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
}

export interface RestaurantData {
  name: string;
  id: string;
  description?: string;
}

// export interface WaiterData {
//   restaurant_name: string | null;
//   username: string;
//   password: string;
//   name?: string;
//   photoUrl?: string;
//   active?: boolean;
//   id?: string;
//   tables: Array<string>;
// }

export interface KitchenData {
  restaurant_name: string;
  username: string;
  password: string;
}

export interface TableItems {
  id: string;
  number: string;
}

export interface FloorData {
  number: number;
  id: string;
  tables: TableItems[];
}

export interface TableData {
  number: number;
  chairs: number;
  shape: "square" | "circle";
  restaurantId: string;
  restaurant_name: string;
  userId: string;
  floorId: string;
  id: string;
}

export interface WaiterData {
  username: string;
  password: string;
  restaurantId: string;
  userId: string;
  id: string;
  name: string;
  photoUrl: string;
  active: boolean;
  tables: string[];
}
