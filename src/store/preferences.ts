import dayjs from 'dayjs';
import { create } from 'zustand';

interface IPreferencesStore {
  pomodoroTimerLength: Date;
  shortBreakLength: Date;
  longBreakLength: Date;
}

export const usePreferencesStore = create<IPreferencesStore>((set, get) => ({
  pomodoroTimerLength: dayjs().set('minute', 30).set('second', 0).toDate(),
  shortBreakLength: dayjs().set('minute', 5).set('second', 0).toDate(),
  longBreakLength: dayjs().set('minute', 15).set('second', 0).toDate(),
}));
