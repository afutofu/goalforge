import { type IActivityLog } from '@/types';
import clsx from 'clsx';
import React, { useState, type FC, useRef, useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './Button';
import { useActivityLogStore } from '@/store/activityLog';

interface ILogItem extends React.ComponentPropsWithoutRef<'div'> {
  log: IActivityLog;
}

interface IFormInput {
  logText: string;
}

export const LogItem: FC<ILogItem> = ({ log, ...props }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>({
    defaultValues: {
      logText: log.text,
    },
  });

  const { editActivityLog, deleteActivityLog } = useActivityLogStore();

  const { ref } = register('logText');

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const editedLog: IActivityLog = {
      ...log,
      text: data.logText,
    };

    if (data.logText !== log.text) {
      console.log('edit log', data);
      editActivityLog(log.id, editedLog);
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
              deleteActivityLog(log.id);
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
