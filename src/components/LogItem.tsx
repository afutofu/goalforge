import { type IActivityLog } from '@/types';
import clsx from 'clsx';
import React, { useState, type FC, useRef } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './Button';
import { useActivityLogStore } from '@/store/activityLog';

interface ILogItem {
  log: IActivityLog;
}

interface IFormInput {
  logText: string;
}

export const LogItem: FC<ILogItem> = ({ log }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();

  const { editActivityLog, deleteActivityLog } = useActivityLogStore();

  const { ref } = register('logText');

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log('edit log', data);

    const editedLog: IActivityLog = {
      ...log,
      text: data.logText,
    };

    if (data.logText !== log.text) {
      editActivityLog(log.id, editedLog);
    }

    reset();
    setOpen(false);
  };

  return (
    <div
      className={clsx('flex items-center', { 'mb-1': !open }, { 'mb-2': open })}
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
          defaultValue={log.text}
          {...register('logText', { required: true, minLength: 1 })}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
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
                setValue('logText', log.text);
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
