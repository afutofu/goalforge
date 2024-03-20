'use client';

import React, { type FC } from 'react';
import dayjs from '../../dayjs-config';

import { useTaskStore } from '@/store/task';

import { Header } from '@/components/Header';
import { Timer } from '@/containers/Timer';
import { TodoList } from '@/containers/TodoList';
import { Separator } from '@/components/Separator';
import { TaskGraph } from '@/containers/TaskGraph';
import { HourActivityLogger } from '@/containers/HourActivityLogger';
import { AddTodo } from '@/components/AddTodo';

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

  const { dayTasks, weekTasks, monthTasks, yearTasks } = useTaskStore();

  return (
    <main className="flex min-h-screen max-w-full flex-row items-center justify-evenly bg-[url('/images/purplepatternbackground.png')] bg-cover text-white">
      <div className="absolute flex min-h-screen w-full flex-row items-center justify-evenly bg-primary opacity-50 z-10"></div>
      {/* Left / Micro Section */}
      <Section>
        <Header
          title={`Hour Logger - ${date.date()} ${date.format('MMM')} ${date.year()} `}
        />
        <HourActivityLogger date={date} />
        <Separator />
      </Section>

      {/* Middle Section */}
      <Section className="!px-12 !justify-between">
        <Header title={'GoalForge'} />
        <Timer />
        <Separator />

        <Header title={'Selected Task - Not Selected '} />
        <TaskGraph />
        <Separator />

        <Header title={'Daily Tasks'} />
        <AddTodo>+ Add Daily</AddTodo>
        <Separator />
        <TodoList tasks={dayTasks} />
      </Section>

      {/* Right / Macro Section */}
      <Section className="!grid grid-rows-3 grid-cols-1 gap-y-4 z-20">
        <div className="">
          <Header title={'Year Tasks - ' + date.format('YYYY')} />
          <AddTodo>+ Add Yearly</AddTodo>
          <Separator />
          <TodoList
            tasks={yearTasks}
            containerStyle={{
              maxHeight: MACRO_TODO_LIST_MAX_HEIGHT,
            }}
          />
        </div>

        <div className="">
          <Header title={'Month Tasks - ' + date.format('MMMM')} />
          <AddTodo>+ Add Monthly</AddTodo>
          <Separator />
          <TodoList
            tasks={monthTasks}
            containerStyle={{
              maxHeight: MACRO_TODO_LIST_MAX_HEIGHT,
            }}
          />
        </div>

        <div className="">
          <Header
            title={
              'Week Tasks - Week ' +
              Math.ceil((date.date() / date.daysInMonth()) * 4)
            }
          />
          <AddTodo>+ Add Weekly</AddTodo>
          <Separator />
          <TodoList
            tasks={weekTasks}
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
