import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserState {
  user: any;
  setUser: (newUser: any) => void;
}

export const useUserStore = create<UserState>()(
  devtools((set) => ({
    user: {},
    setUser: (newUser: any) => set({ user: newUser }),
  })),
);
