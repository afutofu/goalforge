import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { usePreferencesStore } from '@/store/preferences';
import { type IPreferences } from '@/types';
import dayjs from 'dayjs';
import React, { type FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface IPreferencesModal {
  onClose: () => void;
}

interface IPreferencesForm {
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
}

const INPUT_CONTAINER_CLASSNAMES = 'flex items-center mb-2';
const LABEL_CLASSNAMES = 'min-w-28';
const INPUT_CLASSNAMES = 'w-16 p-1 bg-primary-light text-right';

export const PreferencesModal: FC<IPreferencesModal> = ({ onClose }) => {
  const { preferences, setPreferences } = usePreferencesStore();

  const { pomodoroLength, shortBreakLength, longBreakLength } = preferences;

  const { register, handleSubmit } = useForm<IPreferencesForm>();

  const onSubmit: SubmitHandler<IPreferencesForm> = (data) => {
    const timerPreferences = {
      pomodoroLength: dayjs()
        .set('minute', data.pomodoroLength)
        .set('second', 0)
        .toDate(),
      shortBreakLength: dayjs()
        .set('minute', data.shortBreakLength)
        .set('second', 0)
        .toDate(),
      longBreakLength: dayjs()
        .set('minute', data.longBreakLength)
        .set('second', 0)
        .toDate(),
    };

    const newPreferences: IPreferences = {
      ...preferences,
      ...timerPreferences,
    };

    setPreferences(newPreferences);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div
        className="bg-white z-10 flex flex-col p-8 py-6 shadow-xl rounded-lg w-1/5 text-black"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Header titleClassName="!text-primary" lineClassName="border-primary">
          Preferences
        </Header>
        <div className="font-bold mb-3">TIMER</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={INPUT_CONTAINER_CLASSNAMES}>
            <label className={LABEL_CLASSNAMES}>Pomodoro:</label>
            <input
              type="number"
              className={INPUT_CLASSNAMES}
              defaultValue={dayjs(pomodoroLength).minute()}
              {...register('pomodoroLength', {
                required: true,
                valueAsNumber: true,
                min: 0,
              })}
            />
          </div>
          <div className={INPUT_CONTAINER_CLASSNAMES}>
            <label className={LABEL_CLASSNAMES}>Short Break:</label>
            <input
              type="number"
              className={INPUT_CLASSNAMES}
              defaultValue={dayjs(shortBreakLength).minute()}
              {...register('shortBreakLength', {
                required: true,
                valueAsNumber: true,
                min: 0,
              })}
            />
          </div>
          <div className={INPUT_CONTAINER_CLASSNAMES}>
            <label className={LABEL_CLASSNAMES}>Long Break:</label>
            <input
              type="number"
              className={INPUT_CLASSNAMES}
              defaultValue={dayjs(longBreakLength).minute()}
              {...register('longBreakLength', {
                required: true,
                valueAsNumber: true,
                min: 0,
              })}
            />
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
              Cancel
            </button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
