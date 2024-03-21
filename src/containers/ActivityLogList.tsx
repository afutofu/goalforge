import { Header } from '@/components/Header';
import { type IActivityLog } from '@/types';
import dayjs, { type Dayjs } from 'dayjs';
import React, { useMemo, type FC } from 'react';

interface IActivityLogList {
  activityLogs: IActivityLog[];
}

export const ActivityLogList: FC<IActivityLogList> = ({ activityLogs }) => {
  const today = dayjs();

  const activityLogsToday = useMemo(() => {
    const logsToday = [];
    for (let i = 0; i < activityLogs.length; i++) {
      console.log(today.diff(activityLogs[i].createdAt, 'day') > 1);
      if (today.diff(activityLogs[i].createdAt, 'day') > 1) {
        break;
      }
      logsToday.push(activityLogs[i]);
    }

    return logsToday;
  }, [activityLogs]);

  const timePM = (hour: number) => {
    const isAfternoon = hour >= 12;

    if (isAfternoon) {
      let hourPM = hour - 12;
      if (hourPM === 0) hourPM = 12;
      return hourPM + ' PM';
    } else {
      return hour + ' AM';
    }
  };

  const activityLogListWithHour = useMemo(() => {
    let latestHour: number = -1;

    return activityLogsToday.map((log) => {
      let newHour = false;
      if (dayjs(log.createdAt).hour() !== latestHour) {
        newHour = true;
        latestHour = dayjs(log.createdAt).hour();
      }

      return <>{newHour ? <Header>{timePM(latestHour)}</Header> : ''}</>;
    });
  }, [activityLogsToday]);

  console.log(activityLogsToday);

  return <div className="flex flex-col">{activityLogListWithHour}</div>;
};
