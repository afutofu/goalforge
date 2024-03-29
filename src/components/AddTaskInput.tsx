import React, { useState, type FC, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from './Button';

interface IAddTodoButton {
  children: string;
  inputPlaceHolder?: string;
  onAddTaskName: (taskName: string) => void;
}

interface IFormInput {
  taskName: string;
}

export const AddTaskInput: FC<IAddTodoButton> = ({
  children,
  inputPlaceHolder,
  onAddTaskName,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset } = useForm<IFormInput>();

  const { ref } = register('taskName');

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    onAddTaskName(data.taskName);
    reset();
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      if (inputRef.current !== null) inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className={clsx('relative ')}>
      <div
        className={clsx(
          'px-3 py-2 w-full cursor-pointer z-20 outline-none bg-secondary text-primary-light font-medium flex justify-center items-center hover:shadow-xl hover:bg-primary transition',
          {
            'opacity-0 z-0': open,
          },
        )}
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </div>
      <form
        className={clsx(
          'absolute top-0 bg-white cursor-auto rounded-lg shadow text-black flex flex-col px-4 py-5 w-full border-1 border-black z-20',
          { hidden: !open },
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="outline-none mb-3 w-full"
          placeholder={inputPlaceHolder ?? 'Enter task...'}
          {...register('taskName', { required: true, minLength: 1 })}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
        />
        <div className="flex justify-end items-center w-full">
          <button
            className="mr-4 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            Cancel
          </button>
          <Button type="submit">Add</Button>
        </div>
      </form>
    </div>
  );
};
