import { AddTaskInput } from '@/components/AddTaskInput';
import { Separator } from '@/components/Separator';
import { useTaskStore } from '@/store/task';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { TodoList } from './TodoList';
import { type ITask } from '@/types';
import { tasks } from '@/api/endpoints';
import axios from 'axios';
import { MACRO_TODO_LIST_MAX_HEIGHT } from '@/constants';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const WeekTaskList = () => {
  const { weekTasks, setWeekTasks, addWeekTask, editWeekTask, deleteWeekTask } =
    useTaskStore();

  const queryClient = useQueryClient();

  // Add task
  const { mutate: mutateWeekTaskAdd } = useMutation({
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
      addWeekTask(newTask);

      return { previousTasks };
    },
    onError: (_error, _newTask, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setWeekTasks(context.previousTasks);
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
      period: 2,
      createdAt: dayjs().toDate(),
    };

    mutateWeekTaskAdd(newTask);
  };

  return (
    <div>
      <AddTaskInput onAddTaskName={onAddTask}>+ Add Week Task</AddTaskInput>
      <Separator />
      <TodoList
        tasks={weekTasks}
        onEditTask={editWeekTask}
        onDeleteTask={deleteWeekTask}
        containerStyle={{ maxHeight: MACRO_TODO_LIST_MAX_HEIGHT }}
      />
    </div>
  );
};

export default WeekTaskList;
