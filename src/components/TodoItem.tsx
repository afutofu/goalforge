import React, { type FC } from 'react';

import { type ITask } from '@/types';

interface ITodoItem {
  task: ITask;
}

export const TodoItem: FC<ITodoItem> = ({ task }) => {
  return (
    <div className="bg-white px-3 py-2 rounded-full flex flex items-center">
      <div className="p-4 rounded-full mr-4 bg-secondary"></div>
      <span className="text-sm text-black font-bold">{task.name}</span>
    </div>
  );
};
