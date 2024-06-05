import { activityLogEndpoint } from '@/api/endpoints';
import { useActivityLogStore } from '@/store/activityLog';
import { type IActivityLog } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/api';
import dayjs, { type Dayjs } from 'dayjs';
import React, { type FC, useRef, useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '@/store/auth';

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
  const { isAuth } = useAuthStore();

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
    mutationFn: async (newActivityLog) => {
      return await api.post(`${activityLogEndpoint.addLog}`, newActivityLog);
    },
    onMutate: async (newActivityLog: IActivityLog) => {
      await queryClient.cancelQueries({ queryKey: ['activity-logs'] });

      // Snapshot the previous value
      const previousActivityLogs: IActivityLog[] | undefined =
        queryClient.getQueryData(['activity-logs']);

      // Optimistically add the activity log to Zustand state
      addActivityLog(newActivityLog);

      inputRef.current?.blur();

      return { previousActivityLogs };
    },
    onError: (_error, _newActivityLog, context) => {
      // Rollback the optimistic update
      inputRef.current?.focus();

      if (context?.previousActivityLogs != null) {
        setActivityLogs(context.previousActivityLogs);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const newActivityLog: IActivityLog = {
      id: uuidv4(),
      text: data.activityName,
      createdAt: dayjs().utc().format(),
    };

    if (isAuth) {
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
