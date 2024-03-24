import { AddTaskInput } from '@/components/AddTaskInput';
import { Separator } from '@/components/Separator';
import { useTaskStore } from '@/store/task';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { TodoList } from './TodoList';

const DayTaskList = () => {
  const { dayTasks, setDayTasks, addDayTask, editDayTask, deleteDayTask } =
    useTaskStore();

  const { isPending, error, data } = useQuery({
    queryKey: ['getDayTasks'],
    queryFn: async () =>
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/day`).then(
        async (res) => await res.json(),
      ),
  });

  useEffect(() => {
    if (data?.day_tasks) {
      setDayTasks(data.day_tasks);
    }
  }, [data]);

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
