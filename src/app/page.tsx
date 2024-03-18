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
        'w-1/3 border-2 min-h-screen flex flex-col justify-start align-center py-5 px-20 z-20 ' +
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
      <Section>
        <Header title={'Year Goals'} />
        <Separator />

        <Header title={'Month Goals'} />
        <Separator />

        <Header title={'Week Goals'} />
        <Separator />
      </Section>
    </main>
  );
};

export default Home;
