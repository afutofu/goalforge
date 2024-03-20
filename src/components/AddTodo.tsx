import React, { useState, type FC, useRef } from 'react';
import clsx from 'clsx';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from './Button';

interface IAddTodoButton {
  children: string;
  inputPlaceHolder?: string;
}

interface IFormInput {
  taskName: string;
}

export const AddTodo: FC<IAddTodoButton> = ({ children, inputPlaceHolder }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    reset();
    setOpen(false);
  };

  return (
    <div
      className={clsx('relative flex justify-center w-full bg-primary z-0')}
      onClick={() => {
        setOpen(true);
      }}
    >
      <div
        className={clsx('px-3 py-2 w-full cursor-pointer z-10 outline-none', {
          'opacity-0 z-0': open,
        })}
      >
        {children}
      </div>
      <form
        className={clsx(
          'absolute bg-white cursor-auto text-black flex flex-col items-start px-4 py-5 w-full border-1 border-black',
          { 'opacity-0': !open },
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="outline-none mb-3 w-full"
          placeholder={inputPlaceHolder ?? 'Enter task...'}
          {...register('taskName')}
          ref={inputRef}
          autoFocus
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
