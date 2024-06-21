import React, { type FC } from 'react';
import clsx from 'clsx';

interface IAddTodoButton {
  children: string;
  inputPlaceHolder?: string;
  openAddTask: boolean;
  setOpenAddTask: (open: boolean) => void;
}

export const AddTaskInput: FC<IAddTodoButton> = ({
  children,
  openAddTask,
  setOpenAddTask,
}) => {
  return (
    <div className={clsx('relative ')}>
      <div
        className={clsx(
          'px-3 py-2 w-full z-20 outline-none text-primary-light font-medium flex justify-center items-center transition',
          {
            'cursor-pointer hover:shadow-xl bg-secondary hover:bg-primary':
              !openAddTask,
          },
          {
            'bg-primary': openAddTask,
          },
        )}
        onClick={() => {
          setOpenAddTask(true);
        }}
      >
        {openAddTask ? '...' : children}
      </div>
    </div>
  );
};
