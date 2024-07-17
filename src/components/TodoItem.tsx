import React, { useState, type FC, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';

import { type IGoal, type ITask } from '@/types';
import { KebabMenu } from './KebabMenu';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './Button';
import { useGoalStore } from '@/store/goal';

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
  const [goalDropdownOpen, setGoalDropdownOpen] = useState<boolean>(false);
  const [taskGoals, setTaskGoals] = useState<IGoal[]>(task.goals);
  const { goals } = useGoalStore();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();
  const [isGoalDirty, setIsGoalDirty] = useState<boolean>(false);

  const { ref } = register('taskName');

  const availableGoals = useMemo(() => {
    return goals.filter((goal) => {
      return !taskGoals?.some((taskGoal) => {
        return taskGoal.id === goal.id;
      });
    });
  }, [goals, taskGoals]);

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
      goals: taskGoals,
    };

    if (data.taskName !== task.text || isGoalDirty) {
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
        className={clsx('group px-3 py-2 pr-5 flex items-center', {
          hidden: open,
        })}
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
        <div className="flex items-center ml-auto mr-2">
          {task.goals?.map((goal) => {
            return (
              <div
                key={goal.id}
                className="ml-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: goal.color }}
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
          setGoalDropdownOpen(false);
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
          {taskGoals?.map((goal) => {
            return (
              <p
                key={goal.id}
                className={clsx('py-1 px-2 rounded-xl mr-2 h-full mb-1', {
                  'hover:line-through cursor-pointer': taskGoals.length > 1,
                })}
                style={{
                  backgroundColor: goal.color,
                  color: foregroundColor(goal.color),
                }}
                onClick={() => {
                  if (taskGoals.length > 1) {
                    setTaskGoals((prev) =>
                      prev.filter((c) => c.id !== goal.id),
                    );
                  }
                  setIsGoalDirty(true);
                }}
              >
                {goal.name}
              </p>
            );
          })}
          {!goalDropdownOpen && availableGoals.length > 0 && (
            <div
              className="h-[30px] w-[30px] flex justify-center items-center p-2 text-lg hover:color-primary cursor-pointer rounded-full bg-primary-light hover:bg-purple-300 transition-all duration-200 ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                setGoalDropdownOpen(true);
              }}
            >
              +
            </div>
          )}
          {goalDropdownOpen && (
            <select
              className="outline-none"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                const categoryID = e.target.value;
                if (categoryID === '-1') return;
                const goal = availableGoals.find(
                  (goal) => parseInt(goal.id) === parseInt(categoryID),
                );
                if (goal !== undefined) {
                  setTaskGoals([...taskGoals, goal]);
                }
                setGoalDropdownOpen(false);
                if (!isGoalDirty) setIsGoalDirty(true);
              }}
            >
              <option key={0} value={-1}>
                {availableGoals.length === 0
                  ? 'No goals available'
                  : 'Select a goal'}
              </option>
              {availableGoals.map((goal) => {
                return (
                  <option key={goal.id} value={goal.id} className="p-2">
                    {goal.name}
                    {/* <div
                    className="w-[15px] h-[15px] border-[1px] border-black"
                    style={{ background: goal.color }}
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
              setGoalDropdownOpen(false);
              setTaskGoals(task.goals);
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
                setGoalDropdownOpen(false);
                setTaskGoals(task.goals);
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
