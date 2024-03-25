import { type ITask } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ITaskStore {
  // Initial tasks
  dayTasks: ITask[];
  weekTasks: ITask[];
  monthTasks: ITask[];
  yearTasks: ITask[];

  // Setting tasks
  setTasks: (tasks: ITask[]) => void;
  setDayTasks: (tasks: ITask[]) => void;
  setWeekTasks: (tasks: ITask[]) => void;
  setMonthTasks: (tasks: ITask[]) => void;
  setYearTasks: (tasks: ITask[]) => void;

  // Adding tasks
  addDayTask: (task: ITask) => void;
  addWeekTask: (task: ITask) => void;
  addMonthTask: (task: ITask) => void;
  addYearTask: (task: ITask) => void;

  // Editing tasks
  editDayTask: (taskID: string, editedTask: ITask) => void;
  editWeekTask: (taskID: string, editedTask: ITask) => void;
  editMonthTask: (taskID: string, editedTask: ITask) => void;
  editYearTask: (taskID: string, editedTask: ITask) => void;

  // Deleting tasks
  deleteDayTask: (taskID: string) => void;
  deleteWeekTask: (taskID: string) => void;
  deleteMonthTask: (taskID: string) => void;
  deleteYearTask: (taskID: string) => void;
}

export const useTaskStore = create<ITaskStore>()(
  persist(
    (set, get) => ({
      // Initial tasks
      dayTasks: [],
      weekTasks: [],
      monthTasks: [],
      yearTasks: [],

      // Set tasks (for initial tasks from the API)
      setTasks: (tasks: ITask[]) => {
        const dayTasks: ITask[] = [];
        const weekTasks: ITask[] = [];
        const monthTasks: ITask[] = [];
        const yearTasks: ITask[] = [];

        tasks.forEach((task) => {
          if (task.period === 1) {
            dayTasks.push(task);
          }
          if (task.period === 2) {
            weekTasks.push(task);
          }
          if (task.period === 3) {
            monthTasks.push(task);
          }
          if (task.period === 4) {
            yearTasks.push(task);
          }
        });

        set({ dayTasks });
        set({ weekTasks });
        set({ monthTasks });
        set({ yearTasks });
      },
      setDayTasks: (tasks: ITask[]) => {
        set({ dayTasks: tasks });
      },
      setWeekTasks: (tasks: ITask[]) => {
        set({ weekTasks: tasks });
      },
      setMonthTasks: (tasks: ITask[]) => {
        set({ monthTasks: tasks });
      },
      setYearTasks: (tasks: ITask[]) => {
        set({ yearTasks: tasks });
      },

      // Add tasks
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

      // Edit tasks
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

      // Delete tasks
      deleteDayTask: (taskID: string) => {
        const currentTasks = get().dayTasks;
        set({ dayTasks: currentTasks.filter((task) => task.id !== taskID) });

        // Make your API call to add the task
        // api.deleteTask(task).catch((error) => {
        //   // Handle error and rollback the state update if needed
        //   set({ dayTasks: currentTasks });
        // });
      },
      deleteWeekTask: (taskID: string) => {
        const currentTasks = get().weekTasks;
        set({ weekTasks: currentTasks.filter((task) => task.id !== taskID) });

        // Make your API call to add the task
        // api.deleteTask(task).catch((error) => {
        //   // Handle error and rollback the state update if needed
        //   set({ weekTasks: currentTasks });
        // });
      },
      deleteMonthTask: (taskID: string) => {
        const currentTasks = get().monthTasks;
        set({ monthTasks: currentTasks.filter((task) => task.id !== taskID) });

        // Make your API call to add the task
        // api.deleteTask(task).catch((error) => {
        //   // Handle error and rollback the state update if needed
        //   set({ monthTasks: currentTasks });
        // });
      },
      deleteYearTask: (taskID: string) => {
        const currentTasks = get().yearTasks;
        set({ yearTasks: currentTasks.filter((task) => task.id !== taskID) });

        // Make your API call to add the task
        // api.deleteTask(task).catch((error) => {
        //   // Handle error and rollback the state update if needed
        //   set({ yearTasks: currentTasks });
        // });
      },
    }),
    { name: 'taskStore' },
  ),
);
