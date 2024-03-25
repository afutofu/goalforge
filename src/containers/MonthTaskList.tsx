import { AddTaskInput } from '@/components/AddTaskInput';
import { Separator } from '@/components/Separator';
import { useTaskStore } from '@/store/task';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { TodoList } from './TodoList';
import { type IGetTasks, type ITask } from '@/types';
import { tasks } from '@/api/endpoints';
import axios from 'axios';
import { MACRO_TODO_LIST_MAX_HEIGHT } from '@/constants';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const MonthTaskList = () => {
  const { monthTasks, setTasks, addMonthTask, editMonthTask, deleteMonthTask } =
    useTaskStore();

  const queryClient = useQueryClient();

  // Add task
  const { mutate: mutateMonthTaskAdd } = useMutation({
    mutationFn: async (newTask) => {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${tasks.addTask}`,
        newTask,
      );
    },
    onMutate: async (newTask: ITask) => {
      await queryClient.cancelQueries('tasks');

      // Snapshot the previous value
      const previousTasks: IGetTasks | undefined =
        queryClient.getQueryData('tasks');

      // Optimistically delete the task from Zustand state
      addMonthTask(newTask);

      return { previousTasks };
    },
    onError: (_error, _newTask, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setTasks(context.previousTasks.data);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries('tasks');
    },
  });

  const onAddTask = (taskName: string) => {
    const newTask: ITask = {
      id: uuidv4(),
      name: taskName,
      completed: false,
      period: 3,
      createdAt: dayjs().toDate(),
    };

    mutateMonthTaskAdd(newTask);
  };

  // Delete task
  const { mutate: mutateMonthTaskDelete } = useMutation({
    mutationFn: async (taskID) => {
      const URL =
        `${process.env.NEXT_PUBLIC_API_URL}${tasks.deleteTask}`.replace(
          ':taskID',
          taskID,
        );
      return await axios.delete(URL);
    },
    onMutate: async (taskID: string) => {
      await queryClient.cancelQueries('tasks');

      // Snapshot the previous value
      const previousTasks: IGetTasks | undefined =
        queryClient.getQueryData('tasks');

      // Optimistically delete the task from Zustand state
      deleteMonthTask(taskID);

      return { previousTasks };
    },
    onError: (_error, _taskID, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setTasks(context.previousTasks.data);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries('tasks');
    },
  });

  return (
    <div>
      <AddTaskInput onAddTaskName={onAddTask}>+ Add Month Task</AddTaskInput>
      <Separator />
      <TodoList
        tasks={monthTasks}
        onEditTask={editMonthTask}
        onDeleteTask={(taskID: string) => {
          mutateMonthTaskDelete(taskID);
        }}
        containerStyle={{ maxHeight: MACRO_TODO_LIST_MAX_HEIGHT }}
      />
    </div>
  );
};

export default MonthTaskList;
