export interface ITask {
  id: string;
  name: string;
  completed: boolean;
  createdAt: Date;
}

export interface IActivityLog {
  id: string;
  text: string;
  createdAt: Date;
}
