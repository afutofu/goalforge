import React, { useState, type FC, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';

import { type ICategory, type ITask } from '@/types';
import { KebabMenu } from './KebabMenu';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './Button';
import { useCategoryStore } from '@/store/category';

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
  const [categoryDropdownOpen, setCategoryDropdownOpen] =
    useState<boolean>(false);
  const [taskCategories, setTaskCategories] = useState<ICategory[]>(
    task.categories,
  );
  const { categories } = useCategoryStore();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();
  const [isCategoryDirty, setIsCategoryDirty] = useState<boolean>(false);

  const { ref } = register('taskName');

  const availableCategories = useMemo(() => {
    return categories.filter((category) => {
      return !taskCategories?.some((taskCategory) => {
        return taskCategory.id === category.id;
      });
    });
  }, [categories, taskCategories]);

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
      text: data.taskName,
      categories: taskCategories,
    };

    if (data.taskName !== task.text || isCategoryDirty) {
      onEditTask(task.id, editedTask);
    }

    reset();
    setOpen(false);
  };

  useEffect(() => {
    if (open && inputRef.current !== null) inputRef.current.focus();
    setValue('taskName', task.text);
  }, [open]);

  const foregroundColor = (backgroundColor: string): 'white' | 'black' => {
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 125 ? 'black' : 'white';
  };

  return (
    // Todo Item when its closed
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
        <span className="text-sm text-black font-bold">{task.text}</span>
        <div className="flex items-center ml-auto mr-1">
          {task.categories?.map((category) => {
            return (
              <div
                key={category.id}
                className="ml-2 w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            );
          })}
        </div>
        <KebabMenu
          className="opacity-0 group-hover:opacity-100"
          onClick={() => {
            setOpen(true);
          }}
        />
      </div>
      {/* Todo Item when its opened: */}
      <form
        className={clsx(
          'cursor-auto text-black flex flex-col items-start px-4 py-5 w-full z-20',
          { hidden: !open },
        )}
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => {
          e.stopPropagation();
          setCategoryDropdownOpen(false);
        }}
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
        <div className="flex flex-wrap mb-3 items-center">
          {taskCategories?.map((category) => {
            return (
              <p
                key={category.id}
                className={clsx('py-1 px-2 rounded-xl mr-2 h-full mb-1', {
                  'hover:line-through cursor-pointer':
                    taskCategories.length > 1,
                })}
                style={{
                  backgroundColor: category.color,
                  color: foregroundColor(category.color),
                }}
                onClick={() => {
                  if (taskCategories.length > 1) {
                    setTaskCategories((prev) =>
                      prev.filter((c) => c.id !== category.id),
                    );
                  }
                  setIsCategoryDirty(true);
                }}
              >
                {category.name}
              </p>
            );
          })}
          {!categoryDropdownOpen && availableCategories.length > 0 && (
            <div
              className="h-[30px] w-[30px] flex justify-center items-center p-2 text-lg hover:color-primary cursor-pointer rounded-full bg-primary-light hover:bg-purple-300 transition-all duration-200 ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                setCategoryDropdownOpen(true);
              }}
            >
              +
            </div>
          )}
          {categoryDropdownOpen && (
            <select
              className="outline-none"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                const categoryID = e.target.value;
                if (categoryID === '-1') return;
                const category = availableCategories.find(
                  (category) => parseInt(category.id) === parseInt(categoryID),
                );
                if (category !== undefined) {
                  setTaskCategories([...taskCategories, category]);
                }
                setCategoryDropdownOpen(false);
                if (!isCategoryDirty) setIsCategoryDirty(true);
              }}
            >
              <option key={0} value={-1}>
                {availableCategories.length === 0
                  ? 'No categories available'
                  : 'Select a category'}
              </option>
              {availableCategories.map((category) => {
                return (
                  <option key={category.id} value={category.id} className="p-2">
                    {category.name}
                    {/* <div
                    className="w-[15px] h-[15px] border-[1px] border-black"
                    style={{ background: category.color }}
                  ></div> */}
                  </option>
                );
              })}
            </select>
          )}
        </div>
        <div className="flex justify-between items-center w-full">
          <button
            className="mr-4 hover:underline text-gray-400"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDeleteTask(task.id);
              setOpen(false);
              setCategoryDropdownOpen(false);
              setTaskCategories(task.categories);
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
                setCategoryDropdownOpen(false);
                setTaskCategories(task.categories);
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
