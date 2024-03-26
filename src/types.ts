export interface ITask {
  id: string;
  name: string;
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
