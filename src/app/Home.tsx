'use client';

import React, { useState, type FC, useMemo, useEffect } from 'react';
import dayjs from '../../dayjs-config';
import Image from 'next/image';

import { Header } from '@/components/Header';
import { Timer } from '@/containers/Timer';
import { Separator } from '@/components/Separator';
// import { TaskGraph } from '@/containers/TaskGraph';
import { HourActivityLogger } from '@/containers/HourActivityLogger';
import { useActivityLogStore } from '@/store/activityLog';
import { ActivityLogList } from '@/containers/ActivityLogList';
import { PreferencesModal } from '@/containers/PreferencesModal';
import { ProfileModal } from '@/containers/ProfileModal';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import DayTaskList from '@/containers/DayTaskList';
import MonthTaskList from '@/containers/MonthTaskList';
import WeekTaskList from '@/containers/WeekTaskList';
import YearTaskList from '@/containers/YearTaskList';
import { useQuery } from '@tanstack/react-query';
import { type IActivityLog, type ITask } from '@/types';
import {
  taskEndpoint,
  activityLogEndpoint,
  authEndpoint,
} from '@/api/endpoints';
import { api } from '@/api/api';
import { useTaskStore } from '@/store/task';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface SectionProps {
  children: JSX.Element[] | JSX.Element;
  className?: string;
}

const Section: FC<SectionProps> = ({ children, className }) => {
  return (
    <section
      className={
        'relative w-1/3 border-none h-screen flex flex-col justify-start py-5 px-20 z-20 ' +
        className
      }
    >
      {children}
    </section>
  );
};

const ICON_BUTTON_CLASSNAMES =
  'w-7 h-7 bg-white rounded-md p-1 pointer-cursor border-white border-[1px] hover:border-primary hover:bg-primary-light transition';

const Home = () => {
  const date = dayjs();

  const { activityLogs, setActivityLogs } = useActivityLogStore();
  const [openPreferencesModal, setOpenPreferencesModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const { data: session } = useSession();

  const { setTasks } = useTaskStore();

  const profileImgSrc: string = useMemo(() => {
    if (session?.user != null) {
      return session.user.image + '';
    }
    return '/icons/profile.svg';
  }, [session]);

  // Fetch and initialize task data from the API
  // eslint-disable-next-line prettier/prettier
  const { data: fetchUserToken } = useQuery<{token: string}>({
    queryKey: ['userToken', session],
    queryFn: async () =>
      await api
        // eslint-disable-next-line prettier/prettier
        .post<{token:string}>(`${process.env.NEXT_PUBLIC_API_URL}${authEndpoint.oauthSignin}`, {email:session?.user?.email, name:session?.user?.name, sign_in_type: 'google'})
        .then((res) => res.data),
    retry: false,
  });

  useEffect(() => {
    localStorage.setItem('userToken', fetchUserToken?.token ?? '');
  }, [fetchUserToken?.token]);

  // Fetch and initialize task data from the API
  // eslint-disable-next-line prettier/prettier
  const { data: allTasksQuery, isSuccess: isFetchTasksSucess } = useQuery<ITask[]>({
    queryKey: ['tasks', fetchUserToken?.token],
    queryFn: async () =>
      await api
        // eslint-disable-next-line prettier/prettier
        .get<ITask[]>(`${process.env.NEXT_PUBLIC_API_URL}${taskEndpoint.getAll}`)
        .then((res) => res.data),
    retry: false,
  });

  useEffect(() => {
    if (isFetchTasksSucess && allTasksQuery != null) {
      setTasks(allTasksQuery);
    }
  }, [isFetchTasksSucess]);

  // Fetch and initialize acitivity log from the API
  const { data: allActivityLogsQuery, isSuccess: isFetchActivityLogsSuccess } =
    useQuery<IActivityLog[]>({
      queryKey: ['activity-logs', fetchUserToken?.token],
      queryFn: async () =>
        await api
          // eslint-disable-next-line prettier/prettier
          .get<IActivityLog[]>(`${process.env.NEXT_PUBLIC_API_URL}${activityLogEndpoint.getDay}?date=${date.utc().format()}`)
          .then((res) => res.data),
      retry: false,
    });

  useEffect(() => {
    if (isFetchActivityLogsSuccess && allActivityLogsQuery != null) {
      setActivityLogs(allActivityLogsQuery);
    }
  }, [isFetchActivityLogsSuccess]);

  return (
    <main className="position flex min-h-screen max-w-full flex-row items-center justify-evenly bg-[url('/images/purplepatternbackground.png')] bg-cover text-white">
      <div className="absolute flex min-h-screen w-full flex-row items-center justify-evenly bg-primary opacity-50 z-10"></div>

      {openPreferencesModal && (
        <PreferencesModal
          onClose={() => {
            setOpenPreferencesModal(false);
          }}
        />
      )}

      {openProfileModal && (
        <ProfileModal
          onClose={() => {
            setOpenProfileModal(false);
          }}
        />
      )}

      {/* Left / Micro Section */}
      <Section>
        <Header>{`Activity Logger - ${date.date()} ${date.format('MMM')} ${date.year()} `}</Header>
        <HourActivityLogger date={date} />
        <Separator />
        <ActivityLogList activityLogs={activityLogs} />
      </Section>

      {/* Middle Section */}
      <Section className="!px-12">
        <Header>
          <div className="flex justify-between items-center">
            <p>GoalForge</p>
            <div className="flex items-center">
              <button
                className={ICON_BUTTON_CLASSNAMES + ' mr-3'}
                onClick={() => {
                  setOpenPreferencesModal(true);
                }}
              >
                <Image
                  src="/icons/preferences.svg"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }} // optional
                  alt="Picture of the author"
                />
              </button>
              <button
                className={clsx(ICON_BUTTON_CLASSNAMES, {
                  '!p-0 overflow-hidden': session != null,
                })}
                onClick={() => {
                  setOpenProfileModal(true);
                }}
              >
                <Image
                  loader={() => profileImgSrc}
                  unoptimized
                  src={profileImgSrc}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }} // optional
                  alt="Picture of the author"
                />
              </button>
            </div>
          </div>
        </Header>
        <Timer />
        <Separator />

        {/* TODO: Create task timer for selected tasks and integrate with chartjs */}
        {/* <Header>{'Selected Task - Not Selected '}</Header>
        <TaskGraph />
        <Separator /> */}

        <Header>Day Tasks</Header>
        <DayTaskList />
      </Section>

      {/* Right / Macro Section */}
      <Section className="!grid grid-rows-3 grid-cols-1 gap-y-4 z-20">
        <div className="">
          <Header>{`Year Tasks - ${date.format('YYYY')}`}</Header>
          <YearTaskList />
        </div>

        <div className="">
          <Header>{`Month Tasks - ${date.format('MMMM')}`}</Header>
          <MonthTaskList />
        </div>

        <div className="">
          <Header>
            {`Week Tasks - Week ${Math.ceil((date.date() / date.daysInMonth()) * 4)}`}
          </Header>
          <WeekTaskList />
        </div>
      </Section>
    </main>
  );
};

export default Home;
