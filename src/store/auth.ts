import { create } from 'zustand';

interface IAuthStore {
  isAuth: boolean;
  user: {
    name: string,
    email: string,
    image: string,
  } | null;
  setUser: (user: { name: string, email: string, image: string }) => void;
  setAuth: (isAuth: boolean) => void;
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
}));
