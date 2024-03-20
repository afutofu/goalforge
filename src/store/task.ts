import { type ITask } from '@/types';
import { create } from 'zustand';

interface ITaskStore {
  dayTasks: ITask[];
  weekTasks: ITask[];
  monthTasks: ITask[];
  yearTasks: ITask[];

  setDayTasks: (tasks: ITask[]) => void;
  setWeekTasks: (tasks: ITask[]) => void;
  setMonthTasks: (tasks: ITask[]) => void;
  setYearTasks: (tasks: ITask[]) => void;

  addDayTask: (task: ITask) => void;
  editDayTask: (taskID: string, editedTask: ITask) => void;
  removeDayTask: (taskID: string) => void;

  addWeekTask: (task: ITask) => void;
  editWeekTask: (taskID: string, editedTask: ITask) => void;
  removeWeekTask: (taskID: string) => void;

  addMonthTask: (task: ITask) => void;
  editMonthTask: (taskID: string, editedTask: ITask) => void;
  removeMonthTask: (taskID: string) => void;

  addYearTask: (task: ITask) => void;
  editYearTask: (taskID: string, editedTask: ITask) => void;
  removeYearTask: (taskID: string) => void;
}

export const useTaskStore = create<ITaskStore>((set, get) => ({
  dayTasks: new Array(10).fill(1).map((_, id) => ({
    id: 'id' + id + Math.random(),
    name: 'Day Task ' + id,
    completed: Math.random() * 10 > 5,
    createdAt: new Date(),
  })),
  setDayTasks: (tasks: ITask[]) => {
    set({ dayTasks: tasks });
  },
  addDayTask: (task: ITask) => {
    const currentTasks = get().dayTasks;
    set({ dayTasks: [...currentTasks, task] });

    // Make your API call to add the task
    // api.addTask(task)
    //   .catch(error => {
    //     // Handle error and rollback the state update if needed
    //     set({ dayTasks: currentTasks });
    //   });
  },
  editDayTask: (taskID: string, editedTask: ITask) => {
    const currentTasks = get().dayTasks;
    set({
      dayTasks: currentTasks.map((task) => {
        if (task.id === taskID) {
          return editedTask;
        }
        return task;
      }),
    });
  },
  removeDayTask: (taskID: string) => {
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
  editWeekTask: (taskID: string, editedTask: ITask) => {
    const currentTasks = get().weekTasks;
    set({
      weekTasks: currentTasks.map((task) => {
        if (task.id === taskID) {
          return editedTask;
        }
        return task;
      }),
    });
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

  monthTasks: new Array(10).fill(1).map((_, id) => ({
    id: 'id' + id + Math.random(),
    name: 'Month Task ' + id,
    completed: Math.random() * 10 > 5,
    createdAt: new Date(),
  })),
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
  editMonthTask: (taskID: string, editedTask: ITask) => {
    const currentTasks = get().monthTasks;
    set({
      monthTasks: currentTasks.map((task) => {
        if (task.id === taskID) {
          return editedTask;
        }
        return task;
      }),
    });
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
  editYearTask: (taskID: string, editedTask: ITask) => {
    const currentTasks = get().yearTasks;
    set({
      yearTasks: currentTasks.map((task) => {
        if (task.id === taskID) {
          return editedTask;
        }
        return task;
      }),
    });
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
