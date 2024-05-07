import { type IActivityLog, type ITask } from '@/types';

export interface IAxiosResponse<T> {
  data: T;
}

export interface IAxiosError {
  response: {
    data: {
      message: string,
    },
  };
}

export interface IOAuthSigninResponse {
  auth_url: string;
}

export interface IEditTaskMutation {
  taskID: string;
  task: ITask;
}

export interface IEditActivityLogMutation {
  activityLogID: string;
  activityLog: IActivityLog;
}
