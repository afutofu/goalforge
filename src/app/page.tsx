import React, { type FC } from 'react';
import dayjs from '../../dayjs-config';

import { Header } from '@/components/Header';
import { Timer } from '@/containers/Timer';
import { TodoList } from '@/containers/TodoList';
import { Separator } from '@/components/Separator';
import { TaskGraph } from '@/containers/TaskGraph';
import { HourActivityLogger } from '@/containers/HourActivityLogger';

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

        <Header title={'Graph'} />
        <TaskGraph />
        <Separator />

        <Header title={'Daily Tasks - ' + date.date()} />
        <div className="bg-primary flex justify-center py-3">+ Add Daily</div>
        <Separator />
        <TodoList
          tasks={[
            { id: '1', name: 'Daily Task 1' },
            { id: '2', name: 'Daily Task 2' },
            { id: '3', name: 'Daily Task 3' },
            { id: '4', name: 'Daily Task 4' },
            { id: '5', name: 'Daily Task 5' },
            { id: '6', name: 'Daily Task 6' },
            { id: '7', name: 'Daily Task 7' },
            { id: '8', name: 'Daily Task 8' },
            { id: '9', name: 'Daily Task 9' },
          ]}
        />
      </Section>

      {/* Right / Macro Section */}
      <Section className="!grid grid-rows-3 grid-cols-1 gap-y-4">
        <div className="">
          <Header title={'Year Goals - ' + date.format('YYYY')} />
          <div className="bg-primary flex justify-center py-3">
            + Add Yearly
          </div>
          <Separator />
          <TodoList
            tasks={[
              { id: '1', name: 'Yearly Task 1' },
              { id: '2', name: 'Yearly Task 2' },
              { id: '3', name: 'Yearly Task 3' },
              { id: '4', name: 'Yearly Task 4' },
              { id: '5', name: 'Yearly Task 5' },
            ]}
            containerStyle={{
              maxHeight: MACRO_TODO_LIST_MAX_HEIGHT,
            }}
          />
        </div>

        <div className="">
          <Header title={'Month Goals - ' + date.format('MMMM')} />
          <div className="bg-primary flex justify-center py-3">
            + Add Monthly
          </div>
          <Separator />
          <TodoList
            tasks={[
              { id: '1', name: 'Monthly Task 1' },
              { id: '2', name: 'Monthly Task 2' },
              { id: '3', name: 'Monthly Task 3' },
              { id: '4', name: 'Monthly Task 4' },
              { id: '5', name: 'Monthly Task 5' },
            ]}
            containerStyle={{
              maxHeight: MACRO_TODO_LIST_MAX_HEIGHT,
            }}
          />
        </div>

        <div className="">
          <Header
            title={
              'Week Goals - Week ' +
              Math.ceil((date.date() / date.daysInMonth()) * 4)
            }
          />
          <div className="bg-primary flex justify-center py-3">
            + Add Weekly
          </div>
          <Separator />
          <TodoList
            tasks={[
              { id: '1', name: 'Weekly Task 1' },
              { id: '2', name: 'Weekly Task 2' },
              { id: '3', name: 'Weekly Task 3' },
              { id: '4', name: 'Weekly Task 4' },
              { id: '5', name: 'Weekly Task 5' },
            ]}
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
