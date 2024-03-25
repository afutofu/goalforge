export interface ITask {
  id: string;
  name: string;
  completed: boolean;
  period?: number;
  createdAt: Date;
}

export interface IGetTasks {
  data: ITask[];
}

export interface IActivityLog {
  id: string;
  text: string;
  createdAt: Date;
}

export interface IPreferences {
  pomodoroLength: Date;
  shortBreakLength: Date;
  longBreakLength: Date;
}
