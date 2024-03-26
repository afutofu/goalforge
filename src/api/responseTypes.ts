import { type IActivityLog, type ITask } from '@/types';

export interface IEditTaskMutation {
  taskID: string;
  task: ITask;
}

export interface IEditActivityLogMutation {
  activityLogID: string;
  activityLog: IActivityLog;
}
