export interface ITask {
  TaskID: string;
  Name: string;
  Completed: boolean;
  Period?: number;
  CreatedAt: Date;
}

export interface IActivityLog {
  ActivityLogID: string;
  Text: string;
  CreatedAt: string;
}

export interface IPreferences {
  pomodoroLength: Date;
  shortBreakLength: Date;
  longBreakLength: Date;
}
