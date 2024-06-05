export interface ITask {
  id: string;
  text: string;
  completed: boolean;
  period?: number;
  createdAt: Date;
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

export interface IUser {
  Name: string;
  Email: string;
  Image: string;
}
