import React, { useState, type FC, useRef, useEffect } from 'react';
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
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
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
          'px-3 py-2 w-full cursor-pointer z-20 outline-none bg-primary flex justify-center items-center',
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
          'absolute top-0 bg-white cursor-auto text-black flex flex-col items-start px-4 py-5 w-full border-1 border-black',
          { hidden: !open },
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="outline-none mb-3 w-full"
          placeholder={inputPlaceHolder ?? 'Enter task...'}
          {...register('taskName', { required: true, minLength: 1 })}
          ref={inputRef}
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
