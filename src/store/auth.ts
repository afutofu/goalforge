import { type IUser } from '@/types';
import { create } from 'zustand';

interface IAuthStore {
  isAuth: boolean;
  user: IUser | null;
  setUser: (user: IUser) => void;
  setAuth: (isAuth: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>((set, get) => ({
  isAuth: false,
  user: null,
  setUser: (user) => {
    set({ user });
  },
  setAuth: (isAuth) => {
    set({ isAuth });
  },
  logout: () => {
    set({ isAuth: false, user: null });
  },
}));
