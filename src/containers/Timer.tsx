import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import dayjs, { type Dayjs } from 'dayjs';

export const Timer = () => {
  const timer = useRef<Dayjs>(dayjs().set('minute', 30).set('second', 0));
  const [time, setTime] = useState<string>(timer.current.format('mm:ss'));
  const [started, setStarted] = useState<boolean>(false);

  const timerInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (started) {
      timerInterval.current = setInterval(() => {
        timer.current = timer.current.subtract(1, 'second');
        setTime(timer.current.format('mm:ss'));
        console.log(timer.current.format('mm:ss'));
      }, 1000);
    } else {
      console.log('clear');
      clearInterval(timerInterval.current);
    }
  }, [started]);

  useEffect(() => {
    console.log(time);
  }, [time]);

  return (
    <div className="flex flex-col items-center bg-primary-light rounded-lg py-5">
      <div className="flex px-3 grid grid-cols-3 gap-2 mb-5">
        <Button small containerClass="mx-1">
          POMODORO
        </Button>
        <Button small containerClass="mx-1">
          SHORT BREAK
        </Button>
        <Button small containerClass="mx-1">
          LONG BREAK
        </Button>
      </div>
      <h1 className="flex justify-center items-center mb-5 text-5xl text-primary font-extrabold">
        {time}
      </h1>
      <div className="flex justify-center items-center">
        <Button
          onClick={() => {
            setStarted(!started);
          }}
        >
          {started ? 'PAUSE' : 'START'}
        </Button>
      </div>
    </div>
  );
};
