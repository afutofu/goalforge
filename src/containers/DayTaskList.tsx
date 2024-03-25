import { AddTaskInput } from '@/components/AddTaskInput';
import { Separator } from '@/components/Separator';
import { useTaskStore } from '@/store/task';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { TodoList } from './TodoList';
import { type ITask } from '@/types';
import { tasks } from '@/api/endpoints';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const DayTaskList = () => {
  const { dayTasks, setDayTasks, addDayTask, editDayTask, deleteDayTask } =
    useTaskStore();

  const queryClient = useQueryClient();

  // Add task
  const { mutate: mutateDayTaskAdd } = useMutation({
    mutationFn: async (newTask) => {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${tasks.addTask}`,
        newTask,
      );
    },
    onMutate: async (newTask: ITask) => {
      await queryClient.cancelQueries('tasks');

      // Snapshot the previous value
      const previousTasks: ITask[] | null | undefined =
        queryClient.getQueryData('tasks');

      // Optimistically delete the task from Zustand state
      addDayTask(newTask);

      return { previousTasks };
    },
    onError: (_error, _newTask, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setDayTasks(context.previousTasks);
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
      period: 1,
      createdAt: dayjs().toDate(),
    };

    mutateDayTaskAdd(newTask);
  };

  // Delete task
  const { mutate: mutateDayTaskDelete } = useMutation({
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
      const previousTasks: ITask[] | null | undefined =
        queryClient.getQueryData('tasks');

      // Optimistically delete the task from Zustand state
      deleteDayTask(taskID);

      return { previousTasks };
    },
    onError: (_error, _taskID, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setDayTasks(context.previousTasks);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries('tasks');
    },
  });

  //   useMutation(async (taskID: string) => {
  //     const currentDayTasks = dayTasks;

  //     deleteDayTask(taskID);

  //     const URL = `${process.env.NEXT_PUBLIC_API_URL}${tasks.deleteTask}`.replace(
  //       ':taskID',
  //       taskID,
  //     );

  //     await axios
  //       .delete(URL)
  //       .then(() => {
  //         void queryClient.invalidateQueries('tasks');
  //       })
  //       .catch(() => {
  //         // Revert back the task if the API call fails
  //         setDayTasks(currentDayTasks);
  //       });
  //   });

  return (
    <div>
      <AddTaskInput onAddTaskName={onAddTask}>+ Add Day Task</AddTaskInput>
      <Separator />
      <TodoList
        tasks={dayTasks}
        onEditTask={editDayTask}
        onDeleteTask={(taskID: string) => {
          mutateDayTaskDelete(taskID);
        }}
      />
    </div>
  );
};

export default DayTaskList;
