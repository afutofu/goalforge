export interface ITask {
  TaskID: string;
  Name: string;
  Completed: boolean;
  Period?: number;
  CreatedAt: Date;
}

export interface IActivityLog {
  id: string;
  text: string;
  createdAt: string;
}

export interface IPreferences {
  pomodoroLength: Date;
  shortBreakLength: Date;
  longBreakLength: Date;
}
