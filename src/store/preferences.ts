import dayjs from 'dayjs';
import { create } from 'zustand';

import { type IPreferences } from '@/types';

interface IPreferencesStore {
  preferences: IPreferences;
  setPreferences: (preferences: IPreferences) => void;
}

export const usePreferencesStore = create<IPreferencesStore>((set, get) => ({
  preferences: {
    pomodoroLength: dayjs().set('minute', 30).set('second', 0).toDate(),
    shortBreakLength: dayjs().set('minute', 5).set('second', 0).toDate(),
    longBreakLength: dayjs().set('minute', 15).set('second', 0).toDate(),
  },

  setPreferences: (preferences) => {
    set({ preferences });
  },
}));
