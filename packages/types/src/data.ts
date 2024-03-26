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

export interface TableData {
  number: number;
  description?: string;
  restaurant_name: string | null;
  place?: string;
  sendTo?: string;
  code?: string;
  restaurant_id: string;
  id?: string;
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

export interface WaiterData {
  restaurant_name: string | null;
  username: string;
  password: string;
  name?: string;
  photoUrl?: string;
  active?: boolean;
  id?: string;
  tables: Array<string>;
}

export interface KitchenData {
  restaurant_name: string;
  username: string;
  password: string;
}
