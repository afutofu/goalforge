import { type IActivityLog } from '@/types';
import clsx from 'clsx';
import React, { useState, type FC, useRef, useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './Button';
import { useActivityLogStore } from '@/store/activityLog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/api';
import { activityLogEndpoint } from '@/api/endpoints';
import { type IEditActivityLogMutation } from '@/api/responseTypes';
import { useAuthStore } from '@/store/auth';

interface ILogItem extends React.ComponentPropsWithoutRef<'div'> {
  log: IActivityLog;
}

interface IFormInput {
  logText: string;
}

export const LogItem: FC<ILogItem> = ({ log, ...props }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isAuth } = useAuthStore();

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>({
    defaultValues: {
      logText: log.text,
    },
  });

  const { setActivityLogs, editActivityLog, deleteActivityLog } =
    useActivityLogStore();

  const queryClient = useQueryClient();

  // Edit activityLog
  const { mutate: mutateActivityLogEdit } = useMutation({
    mutationFn: async ({
      activityLogID,
      activityLog,
    }: IEditActivityLogMutation) => {
      const URL = `${activityLogEndpoint.editActivityLog}`.replace(
        ':activityLogID',
        activityLogID,
      );
      return await api.put(URL, activityLog);
    },
    onMutate: async ({
      activityLogID,
      activityLog,
    }: IEditActivityLogMutation) => {
      await queryClient.cancelQueries({ queryKey: ['activity-logs'] });

      // Snapshot the previous value
      const previousActivityLogs: IActivityLog[] | undefined =
        queryClient.getQueryData(['activity-logs']);

      // Optimistically delete the activityLog from Zustand state
      editActivityLog(activityLogID, activityLog);

      return { previousActivityLogs };
    },
    onError: (_error, _variables, context) => {
      // Rollback the optimistic update
      if (context?.previousActivityLogs != null) {
        setActivityLogs(context.previousActivityLogs);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });

  // Delete activityLog
  const { mutate: mutateActivityLogDelete } = useMutation({
    mutationFn: async (activityLogID) => {
      const URL = `${activityLogEndpoint.deleteActivityLog}`.replace(
        ':activityLogID',
        activityLogID,
      );
      return await api.delete(URL);
    },
    onMutate: async (activityLogID: string) => {
      await queryClient.cancelQueries({ queryKey: ['activity-logs'] });

      // Snapshot the previous value
      const previousActivityLogs: IActivityLog[] | undefined =
        queryClient.getQueryData(['activity-logs']);

      // Optimistically delete the activityLog from Zustand state
      deleteActivityLog(activityLogID);

      return { previousActivityLogs };
    },
    onError: (_error, _variables, context) => {
      // Rollback the optimistic update
      // TODO: Implement rollback based on error message.
      // If 404 activity log not found, remove from zustand state.
      // If 500, set state back to previous logs.
      if (context?.previousActivityLogs != null) {
        setActivityLogs(context.previousActivityLogs);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });

  const { ref } = register('logText');

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const editedLog: IActivityLog = {
      ...log,
      text: data.logText,
    };

    if (data.logText !== log.text) {
      if (isAuth) {
        mutateActivityLogEdit({
          activityLogID: log.id,
          activityLog: editedLog,
        });
      } else {
        editActivityLog(log.id, editedLog);
      }
    }

    reset();
    setOpen(false);
  };

  useEffect(() => {
    if (open && inputRef.current !== null) inputRef.current.focus();
    setValue('logText', log.text);
  }, [open]);

  return (
    <div
      className={clsx(
        'flex items-center cursor-pointer',
        { 'mb-1': !open },
        { 'mb-2': open },
      )}
      {...props}
    >
      <div
        className={clsx('bg-white p-[3px] rounded-full mr-3', { hidden: open })}
      ></div>
      <span
        className={clsx('w-full', { hidden: open })}
        onClick={() => {
          setOpen(true);
        }}
      >
        {log.text}
      </span>
      <form
        className={clsx(
          'cursor-auto text-black flex flex-col items-start px-4 py-5 w-full z-20 bg-white rounded-lg w-full',
          { hidden: !open },
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="outline-none mb-3 w-full"
          {...register('logText', { required: true, minLength: 1 })}
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
        <div className="flex justify-between items-center w-full">
          <button
            className="mr-4 hover:underline text-gray-400"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isAuth) {
                mutateActivityLogDelete(log.id);
              } else {
                deleteActivityLog(log.id);
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
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </div>
  );
};
