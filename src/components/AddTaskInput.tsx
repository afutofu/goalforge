import React, { useState, type FC, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from './Button';
import { type ICategory } from '@/types';
import { useCategoryStore } from '@/store/category';

interface IAddTodoButton {
  children: string;
  inputPlaceHolder?: string;
  onAddTask: (task: { taskName: string, categories: ICategory[] }) => void;
}

interface IFormInput {
  taskName: string;
  categories: string;
}

export const AddTaskInput: FC<IAddTodoButton> = ({
  children,
  inputPlaceHolder,
  onAddTask,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset } = useForm<IFormInput>();

  const { categories } = useCategoryStore();

  const { ref } = register('taskName');

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data, categories);
    const taskName = data.taskName;
    const filteredCategories = categories.filter((category) => {
      return data.categories === category.id.toString();
    });

    const inputTask = {
      taskName,
      categories: filteredCategories,
    };
    // console.log(inputTask);
    onAddTask(inputTask);
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
        <div className="mb-3">
          <select
            className="outline-none mb-3 w-full"
            {...register('categories')}
          >
            {categories.map((category) => {
              return (
                <option key={category.id} value={category.id} className="p-2">
                  <div>{category.name}</div>
                  <div
                    className="w-[15px] h-[15px] border-[1px] border-black"
                    style={{ background: category.color }}
                  ></div>
                </option>
              );
            })}
          </select>
        </div>
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
