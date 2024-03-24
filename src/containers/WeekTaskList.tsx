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

const WeekTaskList = () => {
  const { weekTasks, setWeekTasks, addWeekTask, editWeekTask, deleteWeekTask } =
    useTaskStore();

  const {
    // isPending,
    // error,
    data: fetchedWeekTasks,
  } = useQuery<IGetTasks>({
    queryKey: ['getWeekTasks'],
    queryFn: async () =>
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${tasks.week}`),
  });

  useEffect(() => {
    if (fetchedWeekTasks?.data != null) {
      setWeekTasks(fetchedWeekTasks.data);
    }
  }, [fetchedWeekTasks]);

  return (
    <div>
      <AddTaskInput onAddTask={addWeekTask}>+ Add Week Task</AddTaskInput>
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
