import React, { useState, type FC, useRef, useEffect } from 'react';
import clsx from 'clsx';

import { type ITask } from '@/types';
import { KebabMenu } from './KebabMenu';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './Button';

interface ITodoItem {
  task: ITask;
  onEditTask: (taskID: string, editedTask: ITask) => void;
  onDeleteTask: (taskID: string) => void;
  className?: string;
}

interface IFormInput {
  taskName: string;
}

export const TodoItem: FC<ITodoItem> = ({
  task,
  onEditTask,
  onDeleteTask,
  className = '',
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();

  const { ref } = register('taskName');

  const toggleComplete = () => {
    const editedTask: ITask = {
      ...task,
      completed: !task.completed,
    };

    onEditTask(task.id, editedTask);
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const editedTask: ITask = {
      ...task,
      name: data.taskName,
    };

    if (data.taskName !== task.name) {
      console.log('edit task', data);
      onEditTask(task.id, editedTask);
    }

    reset();
    setOpen(false);
  };

  useEffect(() => {
    if (open && inputRef.current !== null) inputRef.current.focus();
    setValue('taskName', task.name);
  }, [open]);

  return (
    <div
      className={clsx(
        'bg-white',
        { 'rounded-full': !open },
        { 'rounded-lg': open },
        className,
      )}
    >
      <div
        className={clsx(
          'group px-3 py-2 pr-5 flex items-center cursor-pointer',
          {
            hidden: open,
          },
        )}
      >
        <div
          className={clsx(
            'p-4 rounded-full mr-3 transition',
            {
              'bg-secondary hover:opacity-70': task.completed,
            },
            {
              'bg-primary-light hover:bg-purple-300': !task.completed,
            },
          )}
          onClick={toggleComplete}
        />
        <span className="text-sm text-black font-bold">{task.name}</span>
        <KebabMenu
          className="opacity-0 group-hover:opacity-100"
          onClick={() => {
            setOpen(true);
          }}
        />
      </div>
      <form
        className={clsx(
          'cursor-auto text-black flex flex-col items-start px-4 py-5 w-full z-20',
          { hidden: !open },
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="outline-none mb-3 w-full"
          {...register('taskName', { required: true, minLength: 1 })}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleSubmit(onSubmit)();
            }
          }}
        />
        <div className="flex justify-between items-center w-full">
          <button
            className="mr-4 hover:underline text-gray-400"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDeleteTask(task.id);
              setOpen(false);
            }}
          >
            Delete
          </button>
          <div className="flex items-center">
            <button
              className="mr-4 hover:underline text-gray-400"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Cancel
            </button>
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </div>
  );
};
