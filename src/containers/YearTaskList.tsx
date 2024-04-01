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

const YearTaskList = () => {
  const { yearTasks, setTasks, addYearTask, editYearTask, deleteYearTask } =
    useTaskStore();

  const queryClient = useQueryClient();

  // Add task
  const { mutate: mutateYearTaskAdd } = useMutation({
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
      addYearTask(newTask);

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
      id: uuidv4(),
      name: taskName,
      completed: false,
      period: 4,
      createdAt: dayjs().toDate(),
    };

    mutateYearTaskAdd(newTask);
  };

  // Edit task
  const { mutate: mutateYearTaskEdit } = useMutation({
    mutationFn: async ({ taskID, task }: IEditTaskMutation) => {
      const URL =
        `${process.env.NEXT_PUBLIC_API_URL}${taskEndpoint.editTask}`.replace(
          ':taskID',
          taskID,
        );
      return await api.put(URL, task);
    },
    onMutate: async ({ taskID, task }: IEditTaskMutation) => {
      await queryClient.cancelQueries({ queryKey: [{ queryKey: ['tasks'] }] });

      // Snapshot the previous value
      const previousTasks: ITask[] | undefined = queryClient.getQueryData([
        { queryKey: ['tasks'] },
      ]);

      // Optimistically delete the task from Zustand state
      editYearTask(taskID, task);

      return { previousTasks };
    },
    onError: (_error, _taskID, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setTasks(context.previousTasks);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [{ queryKey: ['tasks'] }],
      });
    },
  });

  // Delete task
  const { mutate: mutateYearTaskDelete } = useMutation({
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
      deleteYearTask(taskID);

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
      <AddTaskInput onAddTaskName={onAddTask}>+ Add Year Task</AddTaskInput>
      <Separator />
      <TodoList
        tasks={yearTasks}
        onEditTask={(taskID: string, task: ITask) => {
          mutateYearTaskEdit({ taskID, task });
        }}
        onDeleteTask={(taskID: string) => {
          mutateYearTaskDelete(taskID);
        }}
        containerStyle={{ maxHeight: MACRO_TODO_LIST_MAX_HEIGHT }}
      />
    </div>
  );
};

export default YearTaskList;
