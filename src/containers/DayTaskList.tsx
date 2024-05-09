import { AddTaskInput } from '@/components/AddTaskInput';
import { Separator } from '@/components/Separator';
import { useTaskStore } from '@/store/task';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoList } from './TodoList';
import { type ITask } from '@/types';
import { taskEndpoint } from '@/api/endpoints';
import { api } from '@/api/api';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { type IEditTaskMutation } from '@/api/responseTypes';
import { useAuthStore } from '@/store/auth';

const DayTaskList = () => {
  const { dayTasks, setTasks, addDayTask, editDayTask, deleteDayTask } =
    useTaskStore();

  const queryClient = useQueryClient();

  const { isAuth } = useAuthStore();

  // Add task
  const { mutate: mutateDayTaskAdd } = useMutation({
    mutationFn: async (newTask) => {
      return await api.post(`${taskEndpoint.addTask}`, newTask);
    },
    onMutate: async (newTask: ITask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks: ITask[] | undefined = queryClient.getQueryData([
        'tasks',
      ]);

      // Optimistically delete the task from Zustand state
      addDayTask(newTask);

      return { previousTasks };
    },
    onError: (_error, _newTask, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setTasks(context.previousTasks);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const onAddTask = (taskName: string) => {
    const newTask: ITask = {
      TaskID: uuidv4(),
      Name: taskName,
      Completed: false,
      Period: 1,
      CreatedAt: dayjs().toDate(),
    };

    if (isAuth) {
      mutateDayTaskAdd(newTask);
    } else {
      addDayTask(newTask);
    }
  };

  // Edit task
  const { mutate: mutateDayTaskEdit } = useMutation({
    mutationFn: async ({ taskID, task }: IEditTaskMutation) => {
      const URL = `${taskEndpoint.editTask}`.replace(':taskID', taskID);
      return await api.put(URL, task);
    },
    onMutate: async ({ taskID, task }: IEditTaskMutation) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks: ITask[] | undefined = queryClient.getQueryData([
        'tasks',
      ]);

      // Optimistically delete the task from Zustand state
      editDayTask(taskID, task);

      return { previousTasks };
    },
    onError: (_error, _taskID, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setTasks(context.previousTasks);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task
  const { mutate: mutateDayTaskDelete } = useMutation({
    mutationFn: async (taskID) => {
      const URL = `${taskEndpoint.deleteTask}`.replace(':taskID', taskID);
      return await api.delete(URL);
    },
    onMutate: async (taskID: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks: ITask[] | undefined = queryClient.getQueryData([
        'tasks',
      ]);

      // Optimistically delete the task from Zustand state
      deleteDayTask(taskID);

      return { previousTasks };
    },
    onError: (_error, _taskID, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setTasks(context.previousTasks);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return (
    <div>
      <AddTaskInput onAddTaskName={onAddTask}>+ Add Day Task</AddTaskInput>
      <Separator />
      <TodoList
        tasks={dayTasks}
        onEditTask={(taskID: string, task: ITask) => {
          if (isAuth) {
            mutateDayTaskEdit({ taskID, task });
          } else {
            editDayTask(taskID, task);
          }
        }}
        onDeleteTask={(taskID: string) => {
          if (isAuth) {
            mutateDayTaskDelete(taskID);
          } else {
            deleteDayTask(taskID);
          }
        }}
      />
    </div>
  );
};

export default DayTaskList;
