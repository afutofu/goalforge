import React from 'react';

import { Button } from '@/components/Button';

export const Timer = () => {
  return (
    <div className="flex flex-col items-center bg-primary-light rounded-lg py-5">
      <div className="flex flex-row justify-center items-center mb-5">
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
        30:00
      </h1>
      <div className="flex justify-center items-center">
        <Button>START</Button>
      </div>
    </div>
  );
};
