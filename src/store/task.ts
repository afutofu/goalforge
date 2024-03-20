import { type ITask } from '@/types';
import { create } from 'zustand';

interface ITaskStore {
  dayTasks: ITask[];
  weekTasks: ITask[];
  monthTasks: ITask[];
  yearTasks: ITask[];
  setDailyTasks: (tasks: ITask[]) => void;
  setWeekTasks: (tasks: ITask[]) => void;
  setMonthTasks: (tasks: ITask[]) => void;
  setYearTasks: (tasks: ITask[]) => void;
  addDailyTask: (task: ITask) => void;
  removeDailyTask: (taskID: string) => void;
  addWeekTask: (task: ITask) => void;
  removeWeekTask: (taskID: string) => void;
  addMonthTask: (task: ITask) => void;
  removeMonthTask: (taskID: string) => void;
  addYearTask: (task: ITask) => void;
  removeYearTask: (taskID: string) => void;
}

export const useTaskStore = create<ITaskStore>((set, get) => ({
  dayTasks: [],
  setDailyTasks: (tasks: ITask[]) => {
    set({ dayTasks: tasks });
  },
  addDailyTask: (task: ITask) => {
    const currentTasks = get().dayTasks;
    set({ dayTasks: [...currentTasks, task] });

    // Make your API call to add the task
    // api.addTask(task)
    //   .catch(error => {
    //     // Handle error and rollback the state update if needed
    //     set({ dayTasks: currentTasks });
    //   });
  },
  removeDailyTask: (taskID: string) => {
    const currentTasks = get().dayTasks;
    set({ dayTasks: currentTasks.filter((task) => task.id !== taskID) });

    // Make your API call to add the task
    // api.removeTask(task).catch((error) => {
    //   // Handle error and rollback the state update if needed
    //   set({ dayTasks: currentTasks });
    // });
  },

  weekTasks: [],
  setWeekTasks: (tasks: ITask[]) => {
    set({ weekTasks: tasks });
  },
  addWeekTask: (task: ITask) => {
    const currentTasks = get().weekTasks;
    set({ weekTasks: [...currentTasks, task] });

    // Make your API call to add the task
    // api.addTask(task)
    //   .catch(error => {
    //     // Handle error and rollback the state update if needed
    //     set({ weekTasks: currentTasks });
    //   });
  },
  removeWeekTask: (taskID: string) => {
    const currentTasks = get().weekTasks;
    set({ weekTasks: currentTasks.filter((task) => task.id !== taskID) });

    // Make your API call to add the task
    // api.removeTask(task).catch((error) => {
    //   // Handle error and rollback the state update if needed
    //   set({ weekTasks: currentTasks });
    // });
  },

  monthTasks: [],
  setMonthTasks: (tasks: ITask[]) => {
    set({ monthTasks: tasks });
  },
  addMonthTask: (task: ITask) => {
    const currentTasks = get().monthTasks;
    set({ monthTasks: [...currentTasks, task] });

    // Make your API call to add the task
    // api.addTask(task)
    //   .catch(error => {
    //     // Handle error and rollback the state update if needed
    //     set({ monthTasks: currentTasks });
    //   });
  },
  removeMonthTask: (taskID: string) => {
    const currentTasks = get().monthTasks;
    set({ monthTasks: currentTasks.filter((task) => task.id !== taskID) });

    // Make your API call to add the task
    // api.removeTask(task).catch((error) => {
    //   // Handle error and rollback the state update if needed
    //   set({ monthTasks: currentTasks });
    // });
  },

  yearTasks: [],
  setYearTasks: (tasks: ITask[]) => {
    set({ yearTasks: tasks });
  },
  addYearTask: (task: ITask) => {
    const currentTasks = get().yearTasks;
    set({ yearTasks: [...currentTasks, task] });

    // Make your API call to add the task
    // api.addTask(task)
    //   .catch(error => {
    //     // Handle error and rollback the state update if needed
    //     set({ yearTasks: currentTasks });
    //   });
  },
  removeYearTask: (taskID: string) => {
    const currentTasks = get().yearTasks;
    set({ yearTasks: currentTasks.filter((task) => task.id !== taskID) });

    // Make your API call to add the task
    // api.removeTask(task).catch((error) => {
    //   // Handle error and rollback the state update if needed
    //   set({ yearTasks: currentTasks });
    // });
  },
}));
