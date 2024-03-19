import React, { type FC } from 'react';
import { type ITask } from '@/types';
import { TodoItem } from '@/components/TodoItem';

interface ITodoList {
  tasks: ITask[];
  containerClass?: string;
  containerStyle?: React.CSSProperties;
}

export const TodoList: FC<ITodoList> = ({
  tasks,
  containerClass,
  containerStyle,
}) => {
  return (
    <div
      className={
        'flex flex-col overflow-y-scroll no-scrollbar ' + (containerClass ?? '')
      }
      style={containerStyle}
    >
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
  );
};
