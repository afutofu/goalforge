'use client';

import React, { useState, type FC, useMemo, useEffect } from 'react';
import dayjs from '../../../dayjs-config';
import Image from 'next/image';

import { Header } from '@/components/Header';
import { Timer } from '@/app/Home/Timer';
import { Separator } from '@/components/Separator';
// import { TaskGraph } from '@/containers/TaskGraph';
import { HourActivityLogger } from '@/app/Home/HourActivityLogger';
import { useActivityLogStore } from '@/store/activityLog';
import { ActivityLogList } from '@/app/Home/Lists/ActivityLogList';
import { PreferencesModal } from '@/app/Home/Modals/PreferencesModal';
import { ProfileModal } from '@/app/Home/Modals/ProfileModal';
import clsx from 'clsx';
import DayTaskList from '@/app/Home/Lists/DayTaskList';
import MonthTaskList from '@/app/Home/Lists/MonthTaskList';
import WeekTaskList from '@/app/Home/Lists/WeekTaskList';
import YearTaskList from '@/app/Home/Lists/YearTaskList';
import { useQuery } from '@tanstack/react-query';
import {
  type IUser,
  type IActivityLog,
  type ITask,
  type ICategory,
} from '@/types';
import {
  taskEndpoint,
  activityLogEndpoint,
  authEndpoint,
  categoryEndpoint,
} from '@/api/endpoints';
import { api } from '@/api/api';
import { useTaskStore } from '@/store/task';
import utc from 'dayjs/plugin/utc';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { type IAxiosError } from '@/api/responseTypes';
import { CategoryModal } from './Modals/CategoryModal';
import { useCategoryStore } from '@/store/category';

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

export const Home = () => {
  const date = dayjs();

  const { setTasks } = useTaskStore();
  const { setCategories } = useCategoryStore();
  const { activityLogs, setActivityLogs } = useActivityLogStore();
  const [openTasksModal, setOpenTasksModal] = useState(false);
  const [openPreferencesModal, setOpenPreferencesModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const router = useRouter();
  const { isAuth, user, setAuth, setUser } = useAuthStore();

  useEffect(() => {
    // if (localStorage.getItem('userToken') == null) {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('jwt');
    if (token != null || token === '') {
      localStorage.setItem('userToken', token);
      router.replace('/');
    }
    // }
  }, [router]);

  const profileImgSrc: string = useMemo(() => {
    // console.log(user);
    if (user?.image != null) {
      return user.image + '';
    }
    return '/icons/profile.svg';
  }, [isAuth, user]);

  // Fetch and initialize task data from the API
  // eslint-disable-next-line prettier/prettier
  const { data: fetchUserQuery } = useQuery<IUser>({
    queryKey: ['user'],
    queryFn: async () =>
      await api
        // eslint-disable-next-line prettier/prettier
        .get<IUser>(`${authEndpoint.fetch_user}`)
        .then((res) => res.data),
    retry: false,
  });

  useEffect(() => {
    // console.log(fetchUserQuery);
    if (fetchUserQuery != null) {
      setAuth(fetchUserQuery != null);
      setUser(fetchUserQuery);
    }
  }, [fetchUserQuery, setAuth, setUser]);

  // Fetch and initialize task data from the API
  // eslint-disable-next-line prettier/prettier
  const { data: allTasksQuery, isSuccess: isFetchTasksSucess, error: isFetchTasksError } = useQuery<ITask[]>({
    queryKey: ['tasks', isAuth],
    queryFn: async () =>
      await api
        .get<ITask[]>(`${taskEndpoint.getAll}`)
        .then((res) => res.data)
        .catch((err: IAxiosError) => {
          console.log(err);
          throw new Error(err.response.data.error);
        }),
    retry: false,
    enabled: isAuth !== undefined,
  });

  useEffect(() => {
    if (isFetchTasksError !== null) {
      const currentDate = new Date();

      const defaultTasks: ITask[] = [
        {
          id: '1',
          text: 'Test Remove Later',
          completed: false,
          period: 1,
          categories: [
            {
              id: '0',
              color: '#FFFFFF',
              name: 'No Category',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '1',
          text: 'Test Remove Later',
          completed: false,
          period: 1,
          categories: [
            {
              id: '0',
              color: '#FFFFFF',
              name: 'No Category',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '1',
          text: 'Test Remove Later',
          completed: false,
          period: 1,
          categories: [
            {
              id: '0',
              color: '#FFFFFF',
              name: 'No Category',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '1',
          text: 'Test Remove Later',
          completed: false,
          period: 1,
          categories: [
            {
              id: '0',
              color: '#FFFFFF',
              name: 'No Category',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '1',
          text: 'Test Remove Later',
          completed: false,
          period: 1,
          categories: [
            {
              id: '0',
              color: '#FFFFFF',
              name: 'No Category',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '1',
          text: 'Test Remove Later',
          completed: false,
          period: 1,
          categories: [
            {
              id: '0',
              color: '#FFFFFF',
              name: 'No Category',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '2',
          text: 'Buy groceries',
          completed: false,
          period: 2,
          categories: [
            {
              id: '1',
              color: '#00FF00',
              name: 'Personal',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '3',
          text: 'Walk the dog',
          completed: false,
          period: 1,
          categories: [
            {
              id: '1',
              color: '#00FF00',
              name: 'Personal',
              createdAt: currentDate,
            },
            {
              id: '2',
              color: '#FF0000',
              name: 'Health',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '4',
          text: 'Exercise',
          completed: false,
          period: 1,
          categories: [
            {
              id: '2',
              color: '#FF0000',
              name: 'Health',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '5',
          text: 'Clean the house',
          completed: false,
          period: 1,
          categories: [
            {
              id: '1',
              color: '#00FF00',
              name: 'Personal',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '6',
          text: 'Work on project',
          completed: false,
          period: 2,
          categories: [
            {
              id: '3',
              color: '#0000FF',
              name: 'Work',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '7',
          text: 'Pay bills',
          completed: false,
          period: 3,
          categories: [
            {
              id: '1',
              color: '#00FF00',
              name: 'Personal',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '8',
          text: 'Plan vacation',
          completed: false,
          period: 3,
          categories: [
            {
              id: '1',
              color: '#00FF00',
              name: 'Personal',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
        {
          id: '9',
          text: 'Review year',
          completed: false,
          period: 4,
          categories: [
            {
              id: '1',
              color: '#00FF00',
              name: 'Personal',
              createdAt: currentDate,
            },
          ],
          createdAt: currentDate,
        },
      ];
      setTasks(defaultTasks);
    }

    if (isFetchTasksSucess && allTasksQuery != null) {
      setTasks(allTasksQuery);
    }
  }, [isFetchTasksSucess, isFetchTasksError]);

  // Fetch and initialize category data from the API
  // eslint-disable-next-line prettier/prettier
  const { data: allCategoriesQuery, isSuccess: isFetchCategoriesSuccess, error: isFetchCategoriesError } = useQuery<ICategory[]>({
    queryKey: ['categories', isAuth],
    queryFn: async () =>
      await api
        .get<ICategory[]>(`${categoryEndpoint.getAll}`)
        .then((res) => res.data)
        .catch((err: IAxiosError) => {
          console.log(err);
          throw new Error(err.response.data.error);
        }),
    retry: false,
    enabled: isAuth !== undefined,
  });

  useEffect(() => {
    if (isFetchCategoriesError !== null) {
      const currentDate = new Date();
      const defaultCategories: ICategory[] = [
        {
          id: '0',
          color: '#FFFFFF',
          name: 'No Category',
          createdAt: currentDate,
        },
        {
          id: '1',
          color: '#00FF00',
          name: 'Personal',
          createdAt: currentDate,
        },
        {
          id: '2',
          color: '#FF0000',
          name: 'Health',
          createdAt: currentDate,
        },
        {
          id: '3',
          color: '#0000FF',
          name: 'Work',
          createdAt: currentDate,
        },
      ];
      setCategories(defaultCategories);
    }

    if (isFetchCategoriesSuccess && allCategoriesQuery != null) {
      setCategories(allCategoriesQuery);
    }
  }, [isFetchCategoriesSuccess, isFetchCategoriesError]);

  // Fetch and initialize acitivity logs from the API
  const {
    data: allActivityLogsQuery,
    isSuccess: isFetchActivityLogsSuccess,
    error: isFetchActivityLogsError,
  } = useQuery<IActivityLog[]>({
    queryKey: ['activity-logs', isAuth],
    queryFn: async () =>
      await api
        .get<IActivityLog[]>(
          `${activityLogEndpoint.getDay}?date=${date.utc().format()}`,
        )
        .then((res) => res.data)
        .catch((err: IAxiosError) => {
          throw new Error(err.response.data.error);
        }),
    retry: false,
    enabled: isAuth !== undefined,
  });

  useEffect(() => {
    if (isFetchTasksError !== null) {
      const defaultActivityLogs: IActivityLog[] = [
        {
          id: '1',
          text: 'Entered GoalForge as a guest user',
          createdAt: new Date().toISOString(),
        },
      ];
      setActivityLogs(defaultActivityLogs);
    }

    if (isFetchActivityLogsSuccess && allActivityLogsQuery != null) {
      setActivityLogs(allActivityLogsQuery);
    }
  }, [isFetchActivityLogsSuccess, isFetchActivityLogsError, isFetchTasksError]);

  return (
    <main className="position flex min-h-screen max-w-full flex-row items-center justify-evenly bg-[url('/images/purplepatternbackground.png')] bg-cover text-white xl:px-18 2xl:px-36">
      <div className="absolute flex min-h-screen w-full flex-row items-center justify-evenly bg-primary opacity-50 z-10"></div>

      {openTasksModal && (
        <CategoryModal
          onClose={() => {
            setOpenTasksModal(false);
          }}
        />
      )}

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
              {/*  */}
              <button
                className={ICON_BUTTON_CLASSNAMES + ' mr-3'}
                onClick={() => {
                  setOpenTasksModal(true);
                }}
              >
                <Image
                  src="/icons/tasks.svg"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }} // optional
                  alt="Icon of tasks"
                />
              </button>
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
                  alt="Icon of preferences"
                />
              </button>
              <button
                className={clsx(ICON_BUTTON_CLASSNAMES, {
                  '!p-0 overflow-hidden': isAuth,
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

        <div className="relative h-full overflow-hidden">
          <Header>Day Tasks</Header>
          <DayTaskList />
        </div>
      </Section>

      {/* Right / Macro Section */}
      <Section className="!grid grid-rows-3 grid-cols-1 gap-y-4 z-20">
        <div className="relative h-full overflow-hidden">
          <Header>{`Year Tasks - ${date.format('YYYY')}`}</Header>
          <YearTaskList />
        </div>

        <div className="relative h-full overflow-hidden">
          <Header>{`Month Tasks - ${date.format('MMMM')}`}</Header>
          <MonthTaskList />
        </div>

        <div className="relative h-full overflow-hidden">
          <Header>
            {`Week Tasks - Week ${Math.ceil((date.date() / date.daysInMonth()) * 4)}`}
          </Header>
          <WeekTaskList />
        </div>
      </Section>
    </main>
  );
};
