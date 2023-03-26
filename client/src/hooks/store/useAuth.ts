import { IUser } from "@/types/User";
import { create } from "zustand";

export interface IAuthState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const useAuth = create<IAuthState>((set) => ({
  user: null,
  setUser(user) {
    set({ user });
  },
}));
