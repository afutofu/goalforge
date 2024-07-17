import { api } from '@/api/api';
import { goalEndpoint } from '@/api/endpoints';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { GoalItem } from '@/components/GoalItem';
import { useAuthStore } from '@/store/auth';
import { useGoalStore } from '@/store/goal';
import { type IGoal } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
// import { IGoal } from '@/types';
import React, { type FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

interface IGoalModal {
  onClose: () => void;
}

interface IGoalForm {
  name: string;
  color: string;
}

export const GoalModal: FC<IGoalModal> = ({ onClose }) => {
  const { goals, setGoals, addGoal, editGoal } = useGoalStore();

  const { isAuth } = useAuthStore();

  const { register, handleSubmit, watch, reset } = useForm<IGoalForm>({
    defaultValues: {
      name: '',
      color: '#000000',
    },
  });

  const watchName = watch('name', '');

  const queryClient = useQueryClient();

  // Add goal
  const { mutate: mutateAddGoal } = useMutation({
    mutationFn: async (newGoal) => {
      return await api.post(`${goalEndpoint.addGoal}`, newGoal);
    },
    onMutate: async (newTask: IGoal) => {
      await queryClient.cancelQueries({ queryKey: ['goals'] });

      // Snapshot the previous value
      const previousTasks: IGoal[] | undefined = queryClient.getQueryData([
        'goals',
      ]);

      // Optimistically delete the goal from Zustand state
      addGoal(newTask);

      return { previousTasks };
    },
    onError: (_error, _newTask, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setGoals(context.previousTasks);
      }
    },
    onSuccess: (data, goal) => {
      if (data == null) return;
      const goalFromResponse: IGoal = data.data;

      // When success, replace the goal in Zustand state with the response data (id is different from backend)
      editGoal(goal.id, goalFromResponse);

      void queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const onSubmit: SubmitHandler<IGoalForm> = (data) => {
    if (data.name.length === 0) return;
    if (data.color.length === 0) return;

    const { name, color } = data;

    const newTask: IGoal = {
      id: uuidv4(),
      name,
      color,
      createdAt: dayjs().toDate(),
    };

    if (isAuth) {
      mutateAddGoal(newTask);
    } else {
      addGoal(newTask);
    }

    reset();
  };

  // console.log(watchName);

  return (
    <Modal onClose={onClose}>
      <div
        className="bg-white z-10 flex flex-col p-8 py-6 shadow-xl rounded-lg w-1/4 text-black"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Header titleClassName="!text-primary" lineClassName="border-primary">
          Goals
        </Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Display list of goals */}
          <div className="flex flex-col">
            {goals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
              // <div
              //   key={goal.id}
              //   className="flex justify-between items-center"
              // >
              //   <div>{goal.name}</div>
              //   <div
              //     className="w-[15px] h-[15px] border-[1px] border-black"
              //     style={{ background: goal.color }}
              //   ></div>
              // </div>
            ))}
            <div className="w-full flex mt-3 align-center">
              <input
                {...register('name', { required: true })}
                placeholder="New goal..."
                className="outline-none w-full"
              />
              <input type="color" {...register('color')} />
            </div>
            {watchName.length !== 0 && (
              <Button className="mt-3" type="submit">
                Add
              </Button>
            )}
          </div>
          <hr className="border-primary mt-5 mb-5" />
          <div className="flex justify-end items-center w-full">
            <button
              className="mr-4 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
