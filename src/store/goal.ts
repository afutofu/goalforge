import { type IGoal } from '@/types';
import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

interface IGoalStore {
  // Initial goals
  goals: IGoal[];

  // Setting goal
  setGoals: (goal: IGoal[]) => void;

  // Adding goal
  addGoal: (goal: IGoal) => void;

  // Editing goal
  editGoal: (activityLogID: string, editedGoal: IGoal) => void;

  // Deleting goal
  deleteGoal: (activityLogID: string) => void;
}

export const useGoalStore = create<IGoalStore>((set, get) => ({
  // Initial goals
  goals: [],

  // Set Goal
  setGoals: (goals: IGoal[]) => {
    set({ goals });
  },

  // Add Goal
  addGoal: (goal: IGoal) => {
    const currentactivityLog = get().goals;
    set({ goals: [...currentactivityLog, goal] });

    // Make your API call to add the goal
    // api.addTask(goal)
    //   .catch(error => {
    //     // Handle error and rollback the state update if needed
    //     set({ goal: currentactivityLog });
    //   });
  },
  // Edit Goal
  editGoal: (activityLogID: string, editedGoal: IGoal) => {
    const currentactivityLog = get().goals;
    set({
      goals: currentactivityLog.map((goal) => {
        if (goal.id === activityLogID) {
          return editedGoal;
        }
        return goal;
      }),
    });
  },

  // Delete goal
  deleteGoal: (activityLogID: string) => {
    const currentactivityLog = get().goals;
    set({
      goals: currentactivityLog.filter((goal) => goal.id !== activityLogID),
    });

    // Make your API call to add the goal
    // api.deleteTask(goal).catch((error) => {
    //   // Handle error and rollback the state update if needed
    //   set({ goal: currentactivityLog });
    // });
  },
}));
