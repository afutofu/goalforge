import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ITimerStore {
  timerType: string;
  started: boolean;
  paused: boolean;
  time: string;
  setTimerType: (type: string) => void;
  setStarted: (started: boolean) => void;
  setPaused: (paused: boolean) => void;
  setTime: (time: string) => void;
}

export const useTimerStore = create<ITimerStore>()(
  persist(
    (set, get) => ({
      timerType: '',
      started: false,
      paused: false,
      time: '',

      setTimerType: (timerType) => {
        set({ timerType });
      },
      setStarted: (started) => {
        set({ started });
      },
      setPaused: (paused) => {
        set({ paused });
      },
      setTime: (time) => {
        set({ time });
      },
    }),
    { name: 'timerStore' },
  ),
);
