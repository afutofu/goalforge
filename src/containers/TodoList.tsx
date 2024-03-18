import React, { type FC } from 'react';
import { type ITask } from '@/types';
import { TodoItem } from '@/components/TodoItem';
import { Separator } from '@/components/Separator';

interface ITodoList {
  tasks: ITask[];
}

export const TodoList: FC<ITodoList> = ({ tasks }) => {
  return (
    <div className="flex flex-col align-center">
      <div className="bg-primary">+ Add Daily Tasks</div>
      <Separator />
      <div className="flex flex-col align-center">
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
