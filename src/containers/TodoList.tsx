import React, { type FC } from 'react';
import { type ITask } from '@/types';
import { TodoItem } from '@/components/TodoItem';

interface ITodoList {
  tasks: ITask[];
  onEditTask: (taskID: string, editedTask: ITask) => void;
  containerClass?: string;
  containerStyle?: React.CSSProperties;
}

export const TodoList: FC<ITodoList> = ({
  tasks,
  onEditTask,
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
        const todoItem = (
          <TodoItem key={task.id} task={task} onEditTask={onEditTask} />
        );

        if (i !== tasks.length - 1)
          return (
            <>
              {todoItem}
              <div className="mb-2"></div>
            </>
          );
        else return todoItem;
      })}
    </div>
  );
};
