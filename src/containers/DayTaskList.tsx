import { AddTaskInput } from '@/components/AddTaskInput';
import { Separator } from '@/components/Separator';
import { useTaskStore } from '@/store/task';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { TodoList } from './TodoList';
import { type IGetTasks } from '@/types';
import { tasks } from '@/api/endpoints';
import axios from 'axios';

const DayTaskList = () => {
  const { dayTasks, setDayTasks, addDayTask, editDayTask, deleteDayTask } =
    useTaskStore();

  const {
    // isPending,
    // error,
    data: fetchedDayTasks,
  } = useQuery<IGetTasks>({
    queryKey: ['getDayTasks'],
    queryFn: async () =>
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${tasks.day}`),
  });

  useEffect(() => {
    if (fetchedDayTasks?.data != null) {
      setDayTasks(fetchedDayTasks.data);
    }
  }, [fetchedDayTasks]);

  return (
    <div>
      <AddTaskInput onAddTask={addDayTask}>+ Add Day Task</AddTaskInput>
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
