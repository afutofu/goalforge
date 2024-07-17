import { type IGoal } from '@/types';
import clsx from 'clsx';
import React, { useState, type FC, useRef, useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './Button';
import { useGoalStore } from '@/store/goal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/api';
import { goalEndpoint } from '@/api/endpoints';
import { type IEditGoalMutation } from '@/api/responseTypes';
import { useAuthStore } from '@/store/auth';

interface IGoalItem extends React.ComponentPropsWithoutRef<'div'> {
  goal: IGoal;
}

interface IFormInput {
  name: string;
  color: string;
}

export const GoalItem: FC<IGoalItem> = ({ goal, ...props }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm<IFormInput>({
    defaultValues: {
      name: goal.name,
      color: goal.color,
    },
  });

  const { setGoals, editGoal, deleteGoal } = useGoalStore();

  const queryClient = useQueryClient();

  // Edit goal
  const { mutate: mutateEditGoal } = useMutation({
    mutationFn: async ({ goalID, goal }: IEditGoalMutation) => {
      const URL = `${goalEndpoint.editGoal}`.replace(':goalID', goalID);
      return await api.put(URL, goal);
    },
    onMutate: async ({ goalID, goal }: IEditGoalMutation) => {
      await queryClient.cancelQueries({ queryKey: ['goals'] });

      // Snapshot the previous value
      const previousGoals: IGoal[] | undefined = queryClient.getQueryData([
        'goals',
      ]);

      // Optimistically delete the goal from Zustand state
      editGoal(goalID, goal);

      return { previousGoals };
    },
    onError: (_error, _variables, context) => {
      // Rollback the optimistic update
      if (context?.previousGoals != null) {
        setGoals(context.previousGoals);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  // Delete goal
  const { mutate: mutateActivityLogDelete } = useMutation({
    mutationFn: async (goalID) => {
      const URL = `${goalEndpoint.deleteGoal}`.replace(':goalID', goalID);
      return await api.delete(URL);
    },
    onMutate: async (goalID: string) => {
      await queryClient.cancelQueries({ queryKey: ['goals'] });

      // Snapshot the previous value
      const previousGoals: IGoal[] | undefined = queryClient.getQueryData([
        'goals',
      ]);

      // Optimistically delete the goal from Zustand state
      deleteGoal(goalID);

      return { previousGoals };
    },
    onError: (_error, _variables, context) => {
      // Rollback the optimistic update
      // TODO: Implement rollback based on error message.
      // If 404 activity goal not found, remove from zustand state.
      // If 500, set state back to previous logs.
      if (context?.previousGoals != null) {
        setGoals(context.previousGoals);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const { ref } = register('name');

  const onSubmit: SubmitHandler<IFormInput> = (data, e) => {
    e?.preventDefault();
    const editedLog: IGoal = {
      ...goal,
      name: data.name,
      color: data.color,
    };

    console.log(isDirty);
    if (data.name !== goal.name) {
      if (isAuth) {
        mutateEditGoal({
          goalID: goal.id,
          goal: editedLog,
        });
      } else {
        editGoal(goal.id, editedLog);
      }
    }

    reset();
    setOpen(false);
  };

  useEffect(() => {
    if (open && inputRef.current !== null) inputRef.current.focus();
    setValue('name', goal.name);
  }, [open]);

  return (
    <div
      className={clsx(
        'flex items-center cursor-pointer rounded-lg w-full transition-all duration-200 ease-in-out',
        { 'mb-1': !open },
        { 'mb-2': open },
      )}
      {...props}
    >
      <div
        className={clsx('flex w-full items-center', { hidden: open })}
        onClick={() => {
          setOpen(true);
        }}
      >
        <span>{goal.name}</span>
        <div
          className="w-[15px] h-[15px] border-[1px] border-black ml-auto"
          style={{ background: goal.color }}
        ></div>
      </div>

      <form
        className={clsx(
          'cursor-auto name-black flex flex-col items-start w-full z-20 bg-white rounded-lg w-full shadow-md p-3',
          { hidden: !open },
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex">
          <input
            className="outline-none mb-3 w-full p-1"
            {...register('name', { required: true, minLength: 1 })}
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
          <input type="color" {...register('color')} />
        </div>

        <div className="flex justify-between items-center w-full">
          <button
            className="mr-4 hover:underline text-gray-400"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isAuth) {
                mutateActivityLogDelete(goal.id);
              } else {
                deleteGoal(goal.id);
              }
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
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                void handleSubmit(onSubmit)();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
