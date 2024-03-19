import React, { type FC } from 'react';

import { Header } from '@/components/Header';
import { Timer } from '@/containers/Timer';
import { TodoList } from '@/containers/TodoList';
import { Separator } from '@/components/Separator';

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

const Home = () => {
  return (
    <main className="flex min-h-screen max-w-full flex-row items-center justify-evenly bg-[url('/images/purplepatternbackground.png')] bg-cover text-white">
      <div className="absolute flex min-h-screen w-full flex-row items-center justify-evenly bg-primary opacity-50 z-10"></div>
      <Section>
        <Header title={'Hour Logger'} />
        <Separator />
      </Section>
      <Section className="!px-12">
        <Header title={'GoalForge'} />
        <Timer />
        <Separator />

        <Header title={'Graph'} />
        <Separator />

        <Header title={'Daily Tasks'} />
        <TodoList
          tasks={[
            { id: '1', name: 'Daily Task 1' },
            { id: '2', name: 'Daily Task 2' },
            { id: '3', name: 'Daily Task 3' },
            { id: '4', name: 'Daily Task 4' },
            { id: '5', name: 'Daily Task 5' },
          ]}
        />
        <Separator />
      </Section>
      <Section className="!grid grid-rows-3 grid-cols-1 gap-y-4">
        <div className="">
          <Header title={'Year Goals'} />
          <div className="bg-primary flex justify-center py-3">
            + Add Yearly Todo
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
              maxHeight: 'calc(100% - 8rem)',
            }}
          />
        </div>

        <div className="">
          <Header title={'Month Goals'} />
          <div className="bg-primary flex justify-center py-3">
            + Add Monthly Todo
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
              maxHeight: 'calc(100% - 8rem)',
            }}
          />
        </div>

        <div className="">
          <Header title={'Week Goals'} className="flex-none" />
          <div className="bg-primary flex justify-center py-3">
            + Add Weekly Todo
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
              maxHeight: 'calc(100% - 8rem)',
            }}
          />
        </div>
      </Section>
    </main>
  );
};

export default Home;
