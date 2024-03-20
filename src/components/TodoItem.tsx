import React, { type FC } from 'react';
import clsx from 'clsx';

import { type ITask } from '@/types';

interface ITodoItem {
  task: ITask;
}

export const TodoItem: FC<ITodoItem> = ({ task }) => {
  return (
    <div className="bg-white px-3 py-2 rounded-full flex flex items-center">
      <div
        className={clsx('p-4 rounded-full mr-3 bg-primary-light', {
          '!bg-secondary': task.completed,
        })}
      ></div>
      <span className="text-sm text-black font-bold">{task.name}</span>
    </div>
  );
};
