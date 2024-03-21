import { Header } from '@/components/Header';
import { Separator } from '@/components/Separator';
import { type IActivityLog } from '@/types';
import dayjs from 'dayjs';
import React, { useMemo, type FC } from 'react';

interface IActivityLogList {
  activityLogs: IActivityLog[];
}

export const ActivityLogList: FC<IActivityLogList> = ({ activityLogs }) => {
  const today = dayjs();

  const activityLogsToday = useMemo(() => {
    const logsToday = [];
    for (let i = 0; i < activityLogs.length; i++) {
      console.log(today.day() !== dayjs(activityLogs[i].createdAt).day());
      if (today.day() !== dayjs(activityLogs[i].createdAt).day()) {
        break;
      }
      logsToday.push(activityLogs[i]);
    }

    return logsToday;
  }, [activityLogs, today]);

  const timePM = (hour: number) => {
    const isAfternoon = hour >= 12;

    if (isAfternoon) {
      let hourPM = hour - 12;
      if (hourPM === 0) hourPM = 12;
      return hourPM + ' PM';
    } else {
      if (hour === 0) hour = 12;
      return hour + ' AM';
    }
  };

  const activityLogListWithHour = useMemo(() => {
    let latestHour: number = -1;
    let first: boolean = true;

    return activityLogsToday.map((log) => {
      let newHour = false;
      if (dayjs(log.createdAt).hour() !== latestHour) {
        newHour = true;
        latestHour = dayjs(log.createdAt).hour();
      }

      const header = <Header className="!mb-2">{timePM(latestHour)}</Header>;

      const headerWithSpacing = newHour ? (
        first ? (
          header
        ) : (
          <>
            <Separator />
            {header}
          </>
        )
      ) : (
        ''
      );

      first = false;

      return (
        <>
          {headerWithSpacing}
          <div className="flex items-center mb-1">
            <div className="bg-white p-[3px] rounded-full mr-3"></div>
            <span>{log.name}</span>
          </div>
        </>
      );
    });
  }, [activityLogsToday]);

  console.log(activityLogsToday);

  return (
    <div className="flex flex-col overflow-y-scroll no-scrollbar ">
      {activityLogListWithHour}
    </div>
  );
};
