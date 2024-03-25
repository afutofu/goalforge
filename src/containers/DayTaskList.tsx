import { AddTaskInput } from '@/components/AddTaskInput';
import { Separator } from '@/components/Separator';
import { useTaskStore } from '@/store/task';
import React from 'react';
import { useMutation } from 'react-query';
import { TodoList } from './TodoList';
import { type ITask } from '@/types';
import { tasks } from '@/api/endpoints';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const DayTaskList = () => {
  const { dayTasks, addDayTask, editDayTask, deleteDayTask } = useTaskStore();

  // Add task
  const addDayTaskMutation = useMutation(async (newTask: ITask) => {
    return await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}${tasks.addTask}`,
      newTask,
    );
  });

  const onAddTask = (taskName: string) => {
    const newTask: ITask = {
      id: uuidv4(),
      name: taskName,
      completed: false,
      period: 1,
      createdAt: dayjs().toDate(),
    };

    // Optimistically add the task to the UI
    addDayTask(newTask);

    // Revert back the task if the API call fails
    addDayTaskMutation.mutateAsync(newTask).catch(() => {
      deleteDayTask(newTask.id);
    });
  };

  return (
    <div>
      <AddTaskInput onAddTaskName={onAddTask}>+ Add Day Task</AddTaskInput>
      <Separator />
      <TodoList
        tasks={dayTasks}
        onEditTask={editDayTask}
        onDeleteTask={deleteDayTask}
      />
    </div>
  );
};

export default DayTaskList;
