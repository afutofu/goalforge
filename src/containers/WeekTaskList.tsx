import { AddTaskInput } from '@/components/AddTaskInput';
import { Separator } from '@/components/Separator';
import { useTaskStore } from '@/store/task';
import React from 'react';
import { useMutation } from 'react-query';
import { TodoList } from './TodoList';
import { type ITask } from '@/types';
import { tasks } from '@/api/endpoints';
import axios from 'axios';
import { MACRO_TODO_LIST_MAX_HEIGHT } from '@/constants';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const WeekTaskList = () => {
  const { weekTasks, addWeekTask, editWeekTask, deleteWeekTask } =
    useTaskStore();

  // Add task
  const addWeekTaskMutation = useMutation(async (newTask: ITask) => {
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
    addWeekTask(newTask);

    // Revert back the task if the API call fails
    addWeekTaskMutation.mutateAsync(newTask).catch(() => {
      deleteWeekTask(newTask.id);
    });
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
