import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import dayjs, { type Dayjs } from 'dayjs';
import { usePreferencesStore } from '@/store/preferences';

import { TIMER_TYPE } from '@/constants';

export const Timer = () => {
  const [timerType, setTimerType] = useState<string>(TIMER_TYPE.POMODORO);
  const [started, setStarted] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);

  const timerInterval = useRef<NodeJS.Timeout>();

  const { preferences } = usePreferencesStore();

  const { pomodoroLength, shortBreakLength, longBreakLength } = preferences;

  const timer = useRef<Dayjs>(dayjs(pomodoroLength));
  const [time, setTime] = useState<string>(timer.current.format('mm:ss'));

  const pauseTimer = useCallback(() => {
    setPaused(true);
    clearInterval(timerInterval.current);
  }, []);

  const resetTimer = useCallback(() => {
    setStarted(false);
    setPaused(true);
    clearInterval(timerInterval.current);
  }, []);

  const resetPomodoroTimer = useCallback(() => {
    resetTimer();
    timer.current = dayjs(pomodoroLength);
    setTime(timer.current.format('mm:ss'));
    setTimerType(TIMER_TYPE.POMODORO);
  }, [resetTimer, pomodoroLength]);

  const resetShortBreakTimer = useCallback(() => {
    resetTimer();
    timer.current = dayjs(shortBreakLength);
    setTime(timer.current.format('mm:ss'));
    setTimerType(TIMER_TYPE.SHORT_BREAK);
  }, [resetTimer, shortBreakLength]);

  const resetLongBreakTimer = useCallback(() => {
    resetTimer();
    timer.current = dayjs(longBreakLength);
    setTime(timer.current.format('mm:ss'));
    setTimerType(TIMER_TYPE.LONG_BREAK);
  }, [longBreakLength, resetTimer]);

  const resumeTimer = useCallback(() => {
    setPaused(false);
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
            resetPomodoroTimer(); // If timer was a break, switch to pomodoro
          } else {
            resetShortBreakTimer(); // Else if timer was a pomodoro, switch to short break
          }
        }, 1000);
      }
    }, 1000);
  }, [resetPomodoroTimer, resetShortBreakTimer, timerType]);

  const startTimer = useCallback(() => {
    setStarted(true);
    resumeTimer();
  }, [resumeTimer]);

  // If each of the timer length is changed when not started, reset to change display
  // For pomodoro
  useEffect(() => {
    if (timerType === TIMER_TYPE.POMODORO && !started) resetPomodoroTimer();
  }, [pomodoroLength, resetPomodoroTimer]);

  // For short break
  useEffect(() => {
    if (timerType === TIMER_TYPE.SHORT_BREAK && !started)
      resetShortBreakTimer();
  }, [shortBreakLength, resetShortBreakTimer]);

  // For long break
  useEffect(() => {
    if (timerType === TIMER_TYPE.LONG_BREAK && !started) resetLongBreakTimer();
  }, [longBreakLength, resetLongBreakTimer]);

  return (
    <div className="flex flex-col items-center bg-primary-light rounded-lg py-5">
      <div className="flex px-3 grid grid-cols-3 gap-2 mb-5">
        <Button
          small
          selected={timerType === TIMER_TYPE.POMODORO}
          onClick={resetPomodoroTimer}
        >
          POMODORO
        </Button>
        <Button
          small
          selected={timerType === TIMER_TYPE.SHORT_BREAK}
          onClick={resetShortBreakTimer}
        >
          SHORT BREAK
        </Button>
        <Button
          small
          selected={timerType === TIMER_TYPE.LONG_BREAK}
          onClick={resetLongBreakTimer}
        >
          LONG BREAK
        </Button>
      </div>
      <h1 className="flex justify-center items-center mb-5 text-5xl text-primary font-extrabold">
        {time}
      </h1>
      <div className="flex justify-center items-center">
        <Button
          onClick={() => {
            if (started && paused) {
              resumeTimer();
            } else if (started && !paused) {
              pauseTimer();
            } else {
              startTimer();
            }
          }}
        >
          {started ? (paused ? 'RESUME' : 'PAUSE') : 'START'}
        </Button>
      </div>
    </div>
  );
};
