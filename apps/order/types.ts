export type ItemsType = Array<ItemType>;

export interface ItemType {
  name: string;
  price: string;
  description?: string;
  calories?: string;
  people?: string;
  new?: boolean;
  special?: boolean;
  imageUrl?: string;
  id: string;
  ingredients?: string;
}
