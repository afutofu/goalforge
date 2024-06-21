import React, { useEffect, useRef, type FC } from 'react';
import { type ICategory, type ITask } from '@/types';
import { TodoItem } from './TodoItem';
import { Button } from './Button';
import clsx from 'clsx';
import { useCategoryStore } from '@/store/category';
import { type SubmitHandler, useForm } from 'react-hook-form';

interface ITodoList {
  tasks: ITask[];
  onAddTask: (task: { taskName: string, categories: ICategory[] }) => void;
  onEditTask: (taskID: string, editedTask: ITask) => void;
  onDeleteTask: (taskID: string) => void;
  containerClass?: string;
  containerStyle?: React.CSSProperties;
  inputPlaceHolder?: string;
  openAddTask: boolean;
  setOpenAddTask: (open: boolean) => void;
}

export const TodoList: FC<ITodoList> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  containerClass,
  containerStyle,
  openAddTask,
  inputPlaceHolder,
  setOpenAddTask,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset } = useForm<{
    taskName: string,
    categories: string,
  }>();

  const { categories } = useCategoryStore();

  const { ref } = register('taskName');

  const onSubmit: SubmitHandler<{
    taskName: string,
    categories: string,
  }> = (data) => {
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
    // setOpen(false);
    setOpenAddTask(false);
  };

  useEffect(() => {
    if (openAddTask) {
      if (inputRef.current !== null) inputRef.current.focus();
    }
  }, [openAddTask]);

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
            key={task.id}
            task={task}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            className={i !== tasks.length - 1 ? 'mb-2' : ''}
          />
        );
      })}
      <form
        className={clsx(
          'mt-2 bg-white cursor-auto rounded-lg shadow text-black flex flex-col px-4 py-5 w-full border-1 border-black z-20',
          { hidden: !openAddTask },
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
                  {category.name}
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
              setOpenAddTask(false);
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
