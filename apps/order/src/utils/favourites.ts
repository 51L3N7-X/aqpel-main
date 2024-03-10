import type { ItemArray, ItemData } from "@repo/types";

export interface Store {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
}

export class FavStore {
  private store: ItemArray;

  restaurant_id: string;

  constructor() {
    this.restaurant_id = localStorage.getItem("restaurant_id")!;
    if (localStorage.getItem(`${this.restaurant_id}_favourites`)) {
      this.store = JSON.parse(
        localStorage.getItem(`${this.restaurant_id}_favourites`)!,
      );
    } else {
      localStorage.setItem(
        `${this.restaurant_id}_favourites`,
        JSON.stringify([]),
      );
      this.store = JSON.parse(
        localStorage.getItem(`${this.restaurant_id}_favourites`)!,
      );
    }
  }

  isLiked(itemId: string): boolean {
    const item = this.getItem(itemId);
    if (item) return true;
    return false;
  }

  getItem(itemId: string) {
    return this.store?.find((o) => o.id === itemId);
  }

  addItems(items: Array<any>) {
    this.deleteAll();
    return this.setItemInLocalStorage(items);
  }

  addItem(item: ItemData) {
    this.store?.push(item);
    this.setItemInLocalStorage(this.store);
    return this.getAll();
  }

  getAll() {
    return this.store;
  }

  deleteItem(itemId: string) {
    this.store = this.store?.filter((item) => item.id !== itemId);
    return this.setItemInLocalStorage(this.store);
  }

  deleteAll() {
    localStorage.removeItem(`${this.restaurant_id}_favourites`);
    return {};
  }

  editItem(itemId: string, item: ItemData) {
    const index = this.store?.findIndex((obj) => obj.id === itemId);

    this.store[index] = item;

    return this.setItemInLocalStorage(this.store);
  }

  setItemInLocalStorage(item: any) {
    localStorage.setItem(
      `${this.restaurant_id}_favourites`,
      JSON.stringify(item),
    );
    return this.getAll();
  }
}
