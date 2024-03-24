import { AddTaskInput } from '@/components/AddTaskInput';
import { Separator } from '@/components/Separator';
import { useTaskStore } from '@/store/task';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { TodoList } from './TodoList';
import { type IGetTasks } from '@/types';
import { tasks } from '@/api/endpoints';
import axios from 'axios';
import { MACRO_TODO_LIST_MAX_HEIGHT } from '@/constants';

const MonthTaskList = () => {
  const {
    monthTasks,
    setMonthTasks,
    addMonthTask,
    editMonthTask,
    deleteMonthTask,
  } = useTaskStore();

  const {
    // isPending,
    // error,
    data: fetchedMonthTasks,
  } = useQuery<IGetTasks>({
    queryKey: ['getMonthTasks'],
    queryFn: async () =>
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${tasks.month}`),
  });

  useEffect(() => {
    if (fetchedMonthTasks?.data != null) {
      setMonthTasks(fetchedMonthTasks.data);
    }
  }, [fetchedMonthTasks]);

  return (
    <div>
      <AddTaskInput onAddTask={addMonthTask}>+ Add Day Task</AddTaskInput>
      <Separator />
      <TodoList
        tasks={monthTasks}
        onEditTask={editMonthTask}
        onDeleteTask={deleteMonthTask}
        containerStyle={{ maxHeight: MACRO_TODO_LIST_MAX_HEIGHT }}
      />
    </div>
  );
};

export default MonthTaskList;
