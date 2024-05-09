// import dayjs from 'dayjs';
import React, { type FC } from 'react';
// import { useForm, type SubmitHandler } from 'react-hook-form';

// import { usePreferencesStore } from '@/store/preferences';
// import { type IPreferences } from '@/types';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import GoogleButton from 'react-google-button';
import { api } from '@/api/api';
import { authEndpoint } from '@/api/endpoints';
import {
  type IAxiosResponse,
  type IOAuthSigninResponse,
} from '@/api/responseTypes';
import { useAuthStore } from '@/store/auth';

interface IProfileModal {
  onClose: () => void;
}

// interface IProfileForm {
//   username: string;
//   email: string;
//   password: string;
//   re_password: string;
// }

export const ProfileModal: FC<IProfileModal> = ({ onClose }) => {
  // TODO: Implement custom registration
  // const { register, handleSubmit } = useForm<IProfileForm>();
  // const onSubmit: SubmitHandler<IProfileForm> = (data) => {
  //   onClose();
  // };

  // const { data: session } = useSession();

  const { isAuth, user, logout } = useAuthStore();
  const router = useRouter();

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

        {/* Sign In / Register */}
        {!isAuth && (
          <>
            <GoogleButton
              className="!w-full"
              onClick={async (e) => {
                e.currentTarget.style.pointerEvents = 'none';
                await api
                  .get(authEndpoint.login_google)
                  .then((res: IAxiosResponse<IOAuthSigninResponse>) => {
                    // console.log(res.data.auth_url);
                    // console.log(e);
                    // e.currentTarget.style.pointerEvents = 'auto';
                    router.push(res.data.auth_url);
                  })
                  .catch((err: any) => {
                    console.log(err);
                  });
                // void signIn('google').catch(() => {
                //   e.currentTarget.style.pointerEvents = 'auto';
                // });
              }}
            />
            {/* <Button
              className="!w-full p-3"
              onClick={async (e) => {
                e.currentTarget.style.pointerEvents = 'none';
                void signIn('google').catch(() => {
                  e.currentTarget.style.pointerEvents = 'auto';
                });
              }}
            >
              Sign in with Google
            </Button> */}
            <hr className="w-full mt-5 border-primary"></hr>
          </>
        )}

        {/* Login with email and password later */}

        {/* Sign Out */}
        {isAuth && user !== null && (
          <>
            <p className="font-bold mb-3">Logged in as</p>
            <p>Name:</p>
            <p className="mb-3">{user.Name}</p>
            <p>Email:</p>
            <p className="mb-5">{user.Email}</p>
            <Button
              onClick={async (e) => {
                e.currentTarget.disabled = true;
                void api
                  .post(authEndpoint.logout)
                  .then(() => {
                    localStorage.removeItem('userToken');
                    logout();
                    onClose();
                  })
                  .catch(() => {
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
