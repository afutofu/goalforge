import { AddTaskInput } from '@/components/AddTaskInput';
import { Separator } from '@/components/Separator';
import { useTaskStore } from '@/store/task';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoList } from './TodoList';
import { type ITask } from '@/types';
import { taskEndpoint } from '@/api/endpoints';
import { api } from '@/api/api';
import { MACRO_TODO_LIST_MAX_HEIGHT } from '@/constants';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { type IEditTaskMutation } from '@/api/responseTypes';
import { useSession } from 'next-auth/react';

const MonthTaskList = () => {
  const { monthTasks, setTasks, addMonthTask, editMonthTask, deleteMonthTask } =
    useTaskStore();

  const queryClient = useQueryClient();

  const { data: session } = useSession();

  // Add task
  const { mutate: mutateMonthTaskAdd } = useMutation({
    mutationFn: async (newTask) => {
      return await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}${taskEndpoint.addTask}`,
        newTask,
      );
    },
    onMutate: async (newTask: ITask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks: ITask[] | undefined = queryClient.getQueryData([
        'tasks',
      ]);

      // Optimistically delete the task from Zustand state
      addMonthTask(newTask);

      return { previousTasks };
    },
    onError: (_error, _newTask, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setTasks(context.previousTasks);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const onAddTask = (taskName: string) => {
    const newTask: ITask = {
      TaskID: uuidv4(),
      Name: taskName,
      Completed: false,
      Period: 3,
      CreatedAt: dayjs().toDate(),
    };

    if (session?.user != null) {
      mutateMonthTaskAdd(newTask);
    } else {
      addMonthTask(newTask);
    }
  };

  // Edit task
  const { mutate: mutateMonthTaskEdit } = useMutation({
    mutationFn: async ({ taskID, task }: IEditTaskMutation) => {
      const URL =
        `${process.env.NEXT_PUBLIC_API_URL}${taskEndpoint.editTask}`.replace(
          ':taskID',
          taskID,
        );
      return await api.put(URL, task);
    },
    onMutate: async ({ taskID, task }: IEditTaskMutation) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks: ITask[] | undefined = queryClient.getQueryData([
        'tasks',
      ]);

      // Optimistically delete the task from Zustand state
      editMonthTask(taskID, task);

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
  const { mutate: mutateMonthTaskDelete } = useMutation({
    mutationFn: async (taskID) => {
      const URL =
        `${process.env.NEXT_PUBLIC_API_URL}${taskEndpoint.deleteTask}`.replace(
          ':taskID',
          taskID,
        );
      return await api.delete(URL);
    },
    onMutate: async (taskID: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks: ITask[] | undefined = queryClient.getQueryData([
        'tasks',
      ]);

      // Optimistically delete the task from Zustand state
      deleteMonthTask(taskID);

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

  return (
    <div>
      <AddTaskInput onAddTaskName={onAddTask}>+ Add Month Task</AddTaskInput>
      <Separator />
      <TodoList
        tasks={monthTasks}
        onEditTask={(taskID: string, task: ITask) => {
          if (session?.user != null) {
            mutateMonthTaskEdit({ taskID, task });
          } else {
            editMonthTask(taskID, task);
          }
        }}
        onDeleteTask={(taskID: string) => {
          if (session?.user != null) {
            mutateMonthTaskDelete(taskID);
          } else {
            deleteMonthTask(taskID);
          }
        }}
        containerStyle={{ maxHeight: MACRO_TODO_LIST_MAX_HEIGHT }}
      />
    </div>
  );
};

export default MonthTaskList;
