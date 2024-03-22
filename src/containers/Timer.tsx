import React, { useCallback, useEffect, useRef } from 'react';

import { Button } from '@/components/Button';
import dayjs, { type Dayjs } from 'dayjs';
import { usePreferencesStore } from '@/store/preferences';

import { TIMER_TYPE } from '@/constants';
import { useTimerStore } from '@/store/timer';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const Timer = () => {
  const {
    timerType,
    started,
    paused,
    time,
    setTimerType,
    setStarted,
    setPaused,
    setTime,
  } = useTimerStore();

  const { preferences } = usePreferencesStore();
  const { pomodoroLength, shortBreakLength, longBreakLength } = preferences;

  const timerInterval = useRef<NodeJS.Timeout>();
  const timer = useRef<Dayjs>(dayjs(pomodoroLength));

  useEffect(() => {
    const timerStateSerialized = localStorage.getItem('timerStore');

    if (timerStateSerialized == null) return;

    const timerState: {
      started: boolean,
      paused: boolean,
      timerType: string,
      time: string,
    } = JSON.parse(timerStateSerialized).state;

    const { started, paused, timerType, time } = timerState;

    // Initialize timerType if empty (first time loading)
    if (timerType === '') {
      setTimerType(TIMER_TYPE.POMODORO);
    }

    if (started) {
      // If the timer is started, conditionally load up previous time
      if (time === '') {
        // If first time loading
        timer.current = dayjs(pomodoroLength, 'mm:ss');
      } else {
        // time taken from localStorage
        timer.current = dayjs(time, 'mm:ss');
      }

      // Check pause state
      if (!paused) {
        // If not paused, then resume the timer
        resumeTimer();
      } else {
        pauseTimer();
      }
    }

    return () => {
      clearInterval(timerInterval.current);
    };
  }, []);

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
      console.log(timer.current);
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
