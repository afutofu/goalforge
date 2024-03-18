import React, { type FC } from 'react';
import { type ITask } from '@/types';
import { TodoItem } from '@/components/TodoItem';
import { Separator } from '@/components/Separator';

interface ITodoList {
  tasks: ITask[];
}

export const TodoList: FC<ITodoList> = ({ tasks }) => {
  return (
    <div className="flex flex-col">
      <div className="bg-primary flex justify-center py-3">
        + Add Daily Tasks
      </div>
      <Separator />
      <div className="flex flex-col">
        {tasks.map((task, i) => {
          if (i !== tasks.length - 1)
            return (
              <>
                <TodoItem key={task.id} task={task} />
                <div className="mb-2"></div>
              </>
            );
          else return <TodoItem key={task.id} task={task} />;
        })}
      </div>
    </div>
  );
};
