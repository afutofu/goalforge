// import dayjs from 'dayjs';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { type FC } from 'react';
// import { useForm, type SubmitHandler } from 'react-hook-form';

// import { usePreferencesStore } from '@/store/preferences';
// import { type IPreferences } from '@/types';

import { Button } from '@/components/Button';
import GoogleButton from 'react-google-button';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';

interface IProfileModal {
  onClose: () => void;
}

// interface IPreferencesForm {
//   pomodoroLength: number;
//   shortBreakLength: number;
//   longBreakLength: number;
// }

export const ProfileModal: FC<IProfileModal> = ({ onClose }) => {
  //   const { register, handleSubmit } = useForm<IPreferencesForm>();

  //   const onSubmit: SubmitHandler<IPreferencesForm> = (data) => {

  //     onClose();
  //   };

  const { data: session } = useSession();

  console.log(session);

  return (
    <Modal onClose={onClose}>
      <div
        className="bg-white z-10 flex flex-col p-8 py-6 shadow-xl rounded-lg w-1/4 text-black"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Header titleClassName="!text-primary" lineClassName="border-primary">
          Profile
        </Header>

        {/* Sign In */}
        {session == null && (
          <>
            <GoogleButton
              className="!w-full"
              onClick={async (e) => {
                e.currentTarget.style.pointerEvents = 'none';
                void signIn('google').catch(() => {
                  e.currentTarget.style.pointerEvents = 'auto';
                });
              }}
            />
            <hr className="w-full mt-5 border-primary"></hr>
          </>
        )}

        {/* Login with email and password later */}

        {/* Sign Out */}
        {session?.user != null && (
          <>
            <p className="font-bold mb-3">Logged in as</p>
            <p>Name:</p>
            <p className="mb-3">{session.user.name}</p>
            <p>Email:</p>
            <p className="mb-5">{session.user.email}</p>
            <Button
              onClick={async (e) => {
                e.currentTarget.disabled = true;
                void signOut().catch(() => {
                  e.currentTarget.disabled = false;
                });
              }}
            >
              Sign out
            </Button>
          </>
        )}

        {/* <form onSubmit={handleSubmit(onSubmit)}>
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
        </form> */}
      </div>
    </Modal>
  );
};
