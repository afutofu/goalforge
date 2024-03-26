import { type IActivityLog } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IActivityLogStore {
  // Initial activityLog
  activityLogs: IActivityLog[];

  // Setting activityLog
  setActivityLogs: (activityLog: IActivityLog[]) => void;

  // Adding activityLog
  addActivityLog: (activityLog: IActivityLog) => void;

  // Editing activityLog
  editActivityLog: (
    activityLogID: string,
    editedActivityLog: IActivityLog,
  ) => void;

  // Deleting activityLog
  deleteActivityLog: (activityLogID: string) => void;
}

export const useActivityLogStore = create<IActivityLogStore>()(
  persist(
    (set, get) => ({
      // Initial activityLog
      activityLogs: [],

      // Set activityLog
      setActivityLogs: (activityLogs: IActivityLog[]) => {
        set({ activityLogs });
      },

      // Add activityLog
      addActivityLog: (activityLog: IActivityLog) => {
        const currentactivityLog = get().activityLogs;
        set({ activityLogs: [activityLog, ...currentactivityLog] });

        // Make your API call to add the activityLog
        // api.addTask(activityLog)
        //   .catch(error => {
        //     // Handle error and rollback the state update if needed
        //     set({ ActivityLog: currentactivityLog });
        //   });
      },
      // Edit activityLog
      editActivityLog: (
        activityLogID: string,
        editedActivityLog: IActivityLog,
      ) => {
        const currentactivityLog = get().activityLogs;
        set({
          activityLogs: currentactivityLog.map((activityLog) => {
            if (activityLog.id === activityLogID) {
              return editedActivityLog;
            }
            return activityLog;
          }),
        });
      },

      // Delete activityLog
      deleteActivityLog: (activityLogID: string) => {
        const currentactivityLog = get().activityLogs;
        set({
          activityLogs: currentactivityLog.filter(
            (activityLog) => activityLog.id !== activityLogID,
          ),
        });

        // Make your API call to add the activityLog
        // api.deleteTask(activityLog).catch((error) => {
        //   // Handle error and rollback the state update if needed
        //   set({ ActivityLog: currentactivityLog });
        // });
      },
    }),
    { name: 'activityLogStore' },
  ),
);
