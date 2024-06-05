export interface ITask {
  id: string;
  text: string;
  completed: boolean;
  period?: number;
  createdAt: Date;
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

export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string;
}
