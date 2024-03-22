import React, { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import dayjs, { type Dayjs } from 'dayjs';
import { usePreferencesStore } from '@/store/preferences';

import { TIMER_TYPE } from '@/constants';

export const Timer = () => {
  const [timerType, setTimerType] = useState<string>(TIMER_TYPE.POMODORO);
  const [started, setStarted] = useState<boolean>(false);

  const timerInterval = useRef<NodeJS.Timeout>();

  const { pomodoroTimerLength, shortBreakLength, longBreakLength } =
    usePreferencesStore();

  const timer = useRef<Dayjs>(dayjs(pomodoroTimerLength));
  const [time, setTime] = useState<string>(timer.current.format('mm:ss'));

  const pauseTimer = useCallback(() => {
    setStarted(false);
    clearInterval(timerInterval.current);
  }, []);

  const resePomodoroTimer = useCallback(() => {
    pauseTimer();
    timer.current = dayjs(pomodoroTimerLength);
    setTime(timer.current.format('mm:ss'));
    setTimerType(TIMER_TYPE.POMODORO);
  }, [pauseTimer, pomodoroTimerLength]);

  const resetShortBreakTimer = useCallback(() => {
    pauseTimer();
    timer.current = dayjs(shortBreakLength);
    setTime(timer.current.format('mm:ss'));
    setTimerType(TIMER_TYPE.SHORT_BREAK);
  }, [pauseTimer, shortBreakLength]);

  const resetLongBreakTimer = useCallback(() => {
    pauseTimer();
    timer.current = dayjs(longBreakLength);
    setTime(timer.current.format('mm:ss'));
    setTimerType(TIMER_TYPE.LONG_BREAK);
  }, [longBreakLength, pauseTimer]);

  const startTimer = useCallback(() => {
    setStarted(true);
    timerInterval.current = setInterval(() => {
      timer.current = timer.current.subtract(1, 'second');
      setTime(timer.current.format('mm:ss'));

      // Check if timer reached 00:00
      if (
        timer.current.diff(
          dayjs().set('minute', 0).set('second', 0),
          'second',
        ) === 0
      ) {
        // Add a little delay so that users can see the 00:00 before resetting timer
        setTimeout(() => {
          if (
            timerType === TIMER_TYPE.SHORT_BREAK ||
            timerType === TIMER_TYPE.LONG_BREAK
          ) {
            resePomodoroTimer(); // If timer was a break, switch to pomodoro
          } else {
            resetShortBreakTimer(); // Else if timer was a pomodoro, switch to short break
          }
        }, 1000);
      }
    }, 1000);
  }, [resePomodoroTimer, resetShortBreakTimer, timerType]);

  return (
    <div className="flex flex-col items-center bg-primary-light rounded-lg py-5">
      <div className="flex px-3 grid grid-cols-3 gap-2 mb-5">
        <Button small containerClass="mx-1" onClick={resePomodoroTimer}>
          POMODORO
        </Button>
        <Button small containerClass="mx-1" onClick={resetShortBreakTimer}>
          SHORT BREAK
        </Button>
        <Button small containerClass="mx-1" onClick={resetLongBreakTimer}>
          LONG BREAK
        </Button>
      </div>
      <h1 className="flex justify-center items-center mb-5 text-5xl text-primary font-extrabold">
        {time}
      </h1>
      <div className="flex justify-center items-center">
        <Button
          onClick={() => {
            if (started) pauseTimer();
            else startTimer();
          }}
        >
          {started ? 'PAUSE' : 'START'}
        </Button>
      </div>
    </div>
  );
};
