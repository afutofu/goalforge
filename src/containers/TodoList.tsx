import React, { type FC } from 'react';
import { type ITask } from '@/types';
import { TodoItem } from '@/components/TodoItem';

interface ITodoList {
  tasks: ITask[];
  onEditTask: (taskID: string, editedTask: ITask) => void;
  onDeleteTask: (taskID: string) => void;
  containerClass?: string;
  containerStyle?: React.CSSProperties;
}

export const TodoList: FC<ITodoList> = ({
  tasks,
  onEditTask,
  onDeleteTask,
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
        return (
          <TodoItem
            key={task.TaskID}
            task={task}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            className={i !== tasks.length - 1 ? 'mb-2' : ''}
          />
        );
      })}
    </div>
  );
};
