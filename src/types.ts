export interface ITask {
  id: string;
  name: string;
  completed: boolean;
  createdAt: Date;
}

export interface IActivityLog {
  id: string;
  name: string;
  createdAt: Date;
}
