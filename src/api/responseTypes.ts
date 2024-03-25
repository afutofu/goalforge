import { type ITask } from '@/types';

export interface IGetTasks {
  data: ITask[];
}

export interface IEditTaskMutation {
  taskID: string;
  task: ITask;
}
