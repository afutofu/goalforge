'use client';

import React, { type FC } from 'react';
import dayjs from '../../dayjs-config';

import { useTaskStore } from '@/store/task';

import { Header } from '@/components/Header';
import { Timer } from '@/containers/Timer';
import { TodoList } from '@/containers/TodoList';
import { Separator } from '@/components/Separator';
// import { TaskGraph } from '@/containers/TaskGraph';
import { HourActivityLogger } from '@/containers/HourActivityLogger';
import { AddTaskInput } from '@/components/AddTaskInput';
import { useActivityLogStore } from '@/store/activityLog';
import { ActivityLogList } from '@/containers/ActivityLogList';

interface SectionProps {
  children: JSX.Element[] | JSX.Element;
  className?: string;
}

const Section: FC<SectionProps> = ({ children, className }) => {
  return (
    <section
      className={
        'relative w-1/3 border-2 h-screen flex flex-col justify-start py-5 px-20 z-20 ' +
        className
      }
    >
      {children}
    </section>
  );
};

const MACRO_TODO_LIST_MAX_HEIGHT = 'calc(100% - 7.75rem)';

const Home = () => {
  const date = dayjs();

  const {
    dayTasks,
    weekTasks,
    monthTasks,
    yearTasks,

    addDayTask,
    addWeekTask,
    addMonthTask,
    addYearTask,

    editDayTask,
    editWeekTask,
    editMonthTask,
    editYearTask,

    deleteDayTask,
    deleteWeekTask,
    deleteMonthTask,
    deleteYearTask,
  } = useTaskStore();

  const { activityLogs, addActivityLog } = useActivityLogStore();

  return (
    <main className="flex min-h-screen max-w-full flex-row items-center justify-evenly bg-[url('/images/purplepatternbackground.png')] bg-cover text-white">
      <div className="absolute flex min-h-screen w-full flex-row items-center justify-evenly bg-primary opacity-50 z-10"></div>

      {/* Left / Micro Section */}
      <Section>
        <Header>{`Activity Logger - ${date.date()} ${date.format('MMM')} ${date.year()} `}</Header>
        <HourActivityLogger date={date} onAddActivityLog={addActivityLog} />
        <Separator />
        <ActivityLogList activityLogs={activityLogs} />
      </Section>

      {/* Middle Section */}
      <Section className="!px-12">
        <Header>GoalForge</Header>
        <Timer />
        <Separator />

        {/* TODO: Create task timer for selected tasks and integrate with chartjs */}
        {/* <Header>{'Selected Task - Not Selected '}</Header>
        <TaskGraph />
        <Separator /> */}

        <Header>Day Tasks</Header>
        <AddTaskInput onAddTask={addDayTask}>+ Add Day</AddTaskInput>
        <Separator />
        <TodoList
          tasks={dayTasks}
          onEditTask={editDayTask}
          onDeleteTask={deleteDayTask}
        />
      </Section>

      {/* Right / Macro Section */}
      <Section className="!grid grid-rows-3 grid-cols-1 gap-y-4 z-20">
        <div className="">
          <Header>{'Year Tasks - ' + date.format('YYYY')}</Header>
          <AddTaskInput onAddTask={addYearTask}>+ Add Yearly</AddTaskInput>
          <Separator />
          <TodoList
            tasks={yearTasks}
            onEditTask={editYearTask}
            onDeleteTask={deleteYearTask}
            containerStyle={{
              maxHeight: MACRO_TODO_LIST_MAX_HEIGHT,
            }}
          />
        </div>

        <div className="">
          <Header>{'Month Tasks - ' + date.format('MMMM')}</Header>
          <AddTaskInput onAddTask={addMonthTask}>+ Add Monthly</AddTaskInput>
          <Separator />
          <TodoList
            tasks={monthTasks}
            onEditTask={editMonthTask}
            onDeleteTask={deleteMonthTask}
            containerStyle={{
              maxHeight: MACRO_TODO_LIST_MAX_HEIGHT,
            }}
          />
        </div>

        <div className="">
          <Header>
            {'Week Tasks - Week ' +
              Math.ceil((date.date() / date.daysInMonth()) * 4)}
          </Header>
          <AddTaskInput onAddTask={addWeekTask}>+ Add Weekly</AddTaskInput>
          <Separator />
          <TodoList
            tasks={weekTasks}
            onEditTask={editWeekTask}
            onDeleteTask={deleteWeekTask}
            containerStyle={{
              maxHeight: MACRO_TODO_LIST_MAX_HEIGHT,
            }}
          />
        </div>
      </Section>
    </main>
  );
};

export default Home;
