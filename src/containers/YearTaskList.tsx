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

const YearTaskList = () => {
  const { yearTasks, setYearTasks, addYearTask, editYearTask, deleteYearTask } =
    useTaskStore();

  const {
    // isPending,
    // error,
    data: fetchedYearTasks,
  } = useQuery<IGetTasks>({
    queryKey: ['getYearTasks'],
    queryFn: async () =>
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${tasks.year}`),
  });

  useEffect(() => {
    if (fetchedYearTasks?.data != null) {
      setYearTasks(fetchedYearTasks.data);
    }
  }, [fetchedYearTasks]);

  return (
    <div>
      <AddTaskInput onAddTask={addYearTask}>+ Add Year Task</AddTaskInput>
      <Separator />
      <TodoList
        tasks={yearTasks}
        onEditTask={editYearTask}
        onDeleteTask={deleteYearTask}
        containerStyle={{ maxHeight: MACRO_TODO_LIST_MAX_HEIGHT }}
      />
    </div>
  );
};

export default YearTaskList;
