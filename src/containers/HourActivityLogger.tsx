import { type Dayjs } from 'dayjs';
import React, { useMemo, type FC } from 'react';

interface IHourActivityLogger {
  date: Dayjs;
}

export const HourActivityLogger: FC<IHourActivityLogger> = ({ date }) => {
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

  return (
    <div className="flex flex-col items-center bg-primary-light rounded-lg py-7">
      <div className="text-primary font-bold mb-2 text-lg">{timeString}</div>
      <input
        className="rounded-full py-2 px-3 text-center text-xs text-black placeholder:uppercase placeholder:font-bold"
        placeholder="Log Hour Activity..."
      />
    </div>
  );
};
