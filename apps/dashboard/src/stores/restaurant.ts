import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface RestaurantState {
  restaurant: any;
  setRestaurant: (newRestaurant: any) => void;
}

export const useRestaurantStore = create<RestaurantState>()(
  devtools((set) => ({
    restaurant: {},
    setRestaurant: (newRestaurant: any) => set({ restaurant: newRestaurant }),
  })),
);
