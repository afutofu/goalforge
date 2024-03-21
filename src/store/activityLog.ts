import { type IActivityLog } from '@/types';
import dayjs from 'dayjs';
import { create } from 'zustand';

interface IActivityLogStore {
  // Initial activityLog
  activityLogs: IActivityLog[];

  // Setting activityLog
  setActivityLog: (activityLog: IActivityLog[]) => void;

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

export const useActivityLogStore = create<IActivityLogStore>((set, get) => ({
  // Initial activityLog
  activityLogs: new Array(30).fill(1).map((_, id) => ({
    id: 'id' + id + Math.random(),
    text: 'Random activity ' + (30 - id),
    createdAt: dayjs().subtract(id, 'hour').toDate(),
  })),

  // Set activityLog
  setActivityLog: (activityLogs: IActivityLog[]) => {
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
  editActivityLog: (activityLogID: string, editedActivityLog: IActivityLog) => {
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
}));
