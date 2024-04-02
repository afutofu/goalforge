import { activityLogEndpoint } from '@/api/endpoints';
import { useActivityLogStore } from '@/store/activityLog';
import { type IActivityLog } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/api';
import dayjs, { type Dayjs } from 'dayjs';
import React, { type FC, useRef, useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';

interface IHourActivityLogger {
  date: Dayjs;
}

interface IFormInput {
  activityName: string;
}

export const HourActivityLogger: FC<IHourActivityLogger> = ({ date }) => {
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const timer = useRef<Dayjs>(dayjs());
  const [time, setTime] = useState<string>(timer.current.format('hh:mm A'));
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref } = register('activityName');

  const { setActivityLogs, addActivityLog } = useActivityLogStore();

  useEffect(() => {
    const timerInterval = setInterval(() => {
      timer.current = dayjs();
      setTime(timer.current.format('hh:mm A'));
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  // Add activity log
  const { mutate: mutateActivityLogAdd } = useMutation({
    mutationFn: async (newTask) => {
      return await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}${activityLogEndpoint.addLog}`,
        newTask,
      );
    },
    onMutate: async (newTask: IActivityLog) => {
      await queryClient.cancelQueries({ queryKey: ['activity-logs'] });

      // Snapshot the previous value
      const previousTasks: IActivityLog[] | undefined =
        queryClient.getQueryData(['activity-logs']);

      // Optimistically delete the task from Zustand state
      addActivityLog(newTask);

      inputRef.current?.blur();

      return { previousTasks };
    },
    onError: (_error, _newTask, context) => {
      // Rollback the optimistic update
      inputRef.current?.focus();

      if (context?.previousTasks != null) {
        setActivityLogs(context.previousTasks);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const newActivityLog: IActivityLog = {
      ActivityLogID: uuidv4(),
      Text: data.activityName,
      CreatedAt: dayjs().utc().format(),
    };

    if (session?.user != null) {
      mutateActivityLogAdd(newActivityLog);
    } else {
      addActivityLog(newActivityLog);
    }

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center bg-primary-light rounded-lg py-7"
    >
      <div className="text-primary font-bold mb-3 text-3xl">{time}</div>
      <input
        className="rounded-full py-3 px-3 text-center text-xs text-black placeholder:uppercase placeholder:font-bold"
        placeholder="Log Current Activity..."
        {...register('activityName', { required: true })}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
      />
    </form>
  );
};
