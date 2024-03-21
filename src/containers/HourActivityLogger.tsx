import { type IActivityLog } from '@/types';
import dayjs, { type Dayjs } from 'dayjs';
import React, { type FC, useRef, useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface IHourActivityLogger {
  date: Dayjs;
  onAddActivityLog: (activityLog: IActivityLog) => void;
}

interface IFormInput {
  activityName: string;
}

export const HourActivityLogger: FC<IHourActivityLogger> = ({
  date,
  onAddActivityLog,
}) => {
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const timer = useRef<Dayjs>(dayjs());
  const [time, setTime] = useState<string>(timer.current.format('hh:mm A'));

  useEffect(() => {
    const timerInterval = setInterval(() => {
      timer.current = dayjs();
      setTime(timer.current.format('hh:mm A'));
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const newActivityLog: IActivityLog = {
      id: 'id-' + Math.random() + Math.random(),
      text: data.activityName,
      createdAt: new Date(),
    };

    onAddActivityLog(newActivityLog);

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center bg-primary-light rounded-lg py-7"
    >
      <div className="text-primary font-bold mb-3 text-3xl">{time}</div>
      <input
        className="rounded-full py-3 px-3 text-center text-xs text-black placeholder:uppercase placeholder:font-bold"
        placeholder="Log Current Activity..."
        {...register('activityName', { required: true })}
      />
    </form>
  );
};
