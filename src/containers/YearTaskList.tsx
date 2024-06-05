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
import { useAuthStore } from '@/store/auth';

const YearTaskList = () => {
  const { yearTasks, setTasks, addYearTask, editYearTask, deleteYearTask } =
    useTaskStore();

  const queryClient = useQueryClient();

  const { isAuth } = useAuthStore();

  // Add task
  const { mutate: mutateYearTaskAdd } = useMutation({
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
      text: taskName,
      completed: false,
      period: 4,
      createdAt: dayjs().toDate(),
    };

    if (isAuth) {
      mutateYearTaskAdd(newTask);
    } else {
      addYearTask(newTask);
    }
  };

  // Edit task
  const { mutate: mutateYearTaskEdit } = useMutation({
    mutationFn: async ({ taskID, task }: IEditTaskMutation) => {
      const URL = `${taskEndpoint.editTask}`.replace(':taskID', taskID);
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
    <div className="relative h-full">
      <AddTaskInput onAddTaskName={onAddTask}>+ Add Year Task</AddTaskInput>
      <Separator />
      <TodoList
        tasks={yearTasks}
        onEditTask={(taskID: string, task: ITask) => {
          if (isAuth) {
            mutateYearTaskEdit({ taskID, task });
          } else {
            editYearTask(taskID, task);
          }
        }}
        onDeleteTask={(taskID: string) => {
          if (isAuth) {
            mutateYearTaskDelete(taskID);
          } else {
            deleteYearTask(taskID);
          }
        }}
        containerStyle={{ maxHeight: MACRO_TODO_LIST_MAX_HEIGHT }}
      />
    </div>
  );
};

export default YearTaskList;
