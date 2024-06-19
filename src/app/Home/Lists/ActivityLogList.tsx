import { Header } from '@/components/Header';
import { LogItem } from '@/components/LogItem';
import { Separator } from '@/components/Separator';
import { type IActivityLog } from '@/types';
import dayjs from 'dayjs';
import React, { useMemo, type FC } from 'react';

interface IActivityLogList {
  activityLogs: IActivityLog[];
}

export const ActivityLogList: FC<IActivityLogList> = ({ activityLogs }) => {
  const today = dayjs();
  const sameDate = (date1: dayjs.Dayjs, date2: dayjs.Dayjs): boolean => {
    return (
      date1.year() === date2.year() &&
      date1.month() === date2.month() &&
      date1.day() === date2.day()
    );
  };

  // Get all activity logs that were created today
  const activityLogsToday = useMemo(() => {
    const logsToday = [];
    for (let i = 0; i < activityLogs.length; i++) {
      if (sameDate(today, dayjs(activityLogs[i].createdAt))) {
        logsToday.push(activityLogs[i]);
      }
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

  const activityLogListWithHour: React.JSX.Element[] = useMemo(() => {
    let latestHour: number = -1;
    let first: boolean = true;

    // console.log(activityLogsToday);

    return activityLogsToday.map((log) => {
      let newHour = false;
      // dayjs localizes the time (in UTC) to the user's timezone
      const logHour = dayjs(log.createdAt).hour();

      // If the log was created in a different hour, display the hour header
      if (logHour !== latestHour) {
        newHour = true;
        latestHour = logHour;
      }

      const hourHeader = (
        <Header className="!mb-2" titleClassName="!text-md !font-medium !mb-2">
          {timePM(latestHour)}
        </Header>
      );

      const headerWithSpacing = newHour ? (
        first ? (
          hourHeader
        ) : (
          <>
            <Separator />
            {hourHeader}
          </>
        )
      ) : (
        ''
      );

      first = false;

      return (
        <div key={log.id}>
          {headerWithSpacing}
          <LogItem log={log} />
        </div>
      );
    });
  }, [activityLogsToday]);

  return (
    <div className="flex flex-col overflow-y-scroll no-scrollbar ">
      {activityLogListWithHour}
    </div>
  );
};
