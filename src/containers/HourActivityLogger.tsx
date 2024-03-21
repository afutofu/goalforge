import { type IActivityLog } from '@/types';
import { type Dayjs } from 'dayjs';
import React, { useMemo, type FC } from 'react';
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

  const timeString = useMemo(() => {
    const currentHour = date.hour();
    const isAfternoon = currentHour >= 12;

    if (isAfternoon) {
      const currentHourPM = currentHour - 12;
      if (currentHourPM < 10) {
        return '0' + currentHourPM + ':00 PM - 0' + currentHourPM + ':59 PM';
      } else {
        return currentHourPM + ':00 PM - ' + currentHourPM + ':59 PM';
      }
    } else {
      if (currentHour < 10) {
        return '0' + currentHour + ':00 AM - 0' + currentHour + ':59 AM';
      } else {
        return currentHour + ':00 AM - ' + currentHour + ':59 AM';
      }
    }
  }, [date]);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);

    const newActivityLog: IActivityLog = {
      id: 'id-' + Math.random() + Math.random(),
      name: data.activityName,
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
      <div className="text-primary font-bold mb-2 text-lg">{timeString}</div>
      <input
        className="rounded-full py-2 px-3 text-center text-xs text-black placeholder:uppercase placeholder:font-bold"
        placeholder="Log Hour Activity..."
        {...register('activityName', { required: true })}
      />
    </form>
  );
};
