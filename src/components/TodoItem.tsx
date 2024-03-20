import React, { useState, type FC, useRef, useEffect } from 'react';
import clsx from 'clsx';

import { type ITask } from '@/types';
import { KebabMenu } from './KebabMenu';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './Button';

interface ITodoItem {
  task: ITask;
  onEditTask: (taskID: string, editedTask: ITask) => void;
}

interface IFormInput {
  taskName: string;
}

export const TodoItem: FC<ITodoItem> = ({ task, onEditTask }) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();

  const { ref } = register('taskName');

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);

    const editedTask: ITask = {
      ...task,
      name: data.taskName,
    };

    if (data.taskName !== task.name) {
      onEditTask(task.id, editedTask);
    }

    reset();
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      if (inputRef.current !== null) inputRef.current.focus();
    }
  }, [open]);

  return (
    <div
      className={clsx(
        'bg-white',
        { 'rounded-full': !open },
        { 'rounded-lg': open },
      )}
    >
      <div
        className={clsx('px-3 py-2 pr-5 flex items-center cursor-pointer', {
          hidden: open,
        })}
      >
        <div
          className={clsx('p-4 rounded-full mr-3 bg-primary-light', {
            '!bg-secondary': task.completed,
          })}
        ></div>
        <span className="text-sm text-black font-bold">{task.name}</span>
        <KebabMenu
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
          defaultValue={task.name}
          {...register('taskName', { required: true, minLength: 1 })}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
        />
        <div className="flex justify-between items-center w-full">
          <button
            className="mr-4 hover:underline text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setValue('taskName', task.name);
            }}
          >
            Delete
          </button>
          <div className="flex items-center">
            <button
              className="mr-4 hover:underline text-gray-400"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                setValue('taskName', task.name);
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
