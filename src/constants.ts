import { type IActivityLog, type ICategory, type ITask } from './types';

export enum TIMER_TYPE {
  POMODORO = 'pomodoro',
  SHORT_BREAK = 'short_break',
  LONG_BREAK = 'long_break',
}

export const MACRO_TODO_LIST_MAX_HEIGHT = 'calc(100% - 7.75rem)';

const currentDate = new Date();

export const defaultTasks: ITask[] = [
  {
    id: '2',
    text: 'Buy groceries',
    completed: false,
    period: 2,
    goals: [
      {
        id: '2',
        color: '#00FF00',
        name: 'Personal',
        createdAt: currentDate,
      },
    ],
    createdAt: currentDate,
  },
  {
    id: '4',
    text: 'Walk the dog',
    completed: false,
    period: 1,
    goals: [
      {
        id: '2',
        color: '#00FF00',
        name: 'Personal',
        createdAt: currentDate,
      },
      {
        id: '3',
        color: '#FF0000',
        name: 'Health',
        createdAt: currentDate,
      },
    ],
    createdAt: currentDate,
  },
  {
    id: '4',
    text: 'Exercise',
    completed: false,
    period: 1,
    goals: [
      {
        id: '3',
        color: '#FF0000',
        name: 'Health',
        createdAt: currentDate,
      },
    ],
    createdAt: currentDate,
  },
  {
    id: '5',
    text: 'Clean the house',
    completed: false,
    period: 1,
    goals: [
      {
        id: '2',
        color: '#00FF00',
        name: 'Personal',
        createdAt: currentDate,
      },
    ],
    createdAt: currentDate,
  },
  {
    id: '6',
    text: 'Work on project',
    completed: false,
    period: 2,
    goals: [
      {
        id: '4',
        color: '#0000FF',
        name: 'Work',
        createdAt: currentDate,
      },
    ],
    createdAt: currentDate,
  },
  {
    id: '7',
    text: 'Pay bills',
    completed: false,
    period: 3,
    goals: [
      {
        id: '2',
        color: '#00FF00',
        name: 'Personal',
        createdAt: currentDate,
      },
    ],
    createdAt: currentDate,
  },
  {
    id: '8',
    text: 'Plan vacation',
    completed: false,
    period: 3,
    goals: [
      {
        id: '2',
        color: '#00FF00',
        name: 'Personal',
        createdAt: currentDate,
      },
    ],
    createdAt: currentDate,
  },
  {
    id: '9',
    text: 'Review year',
    completed: false,
    period: 4,
    goals: [
      {
        id: '2',
        color: '#00FF00',
        name: 'Personal',
        createdAt: currentDate,
      },
    ],
    createdAt: currentDate,
  },
];

export const defaultCategories: ICategory[] = [
  {
    id: '1',
    color: '#FFFFFF',
    name: 'No Category',
    createdAt: currentDate,
  },
  {
    id: '2',
    color: '#00FF00',
    name: 'Personal',
    createdAt: currentDate,
  },
  {
    id: '3',
    color: '#FF0000',
    name: 'Health',
    createdAt: currentDate,
  },
  {
    id: '4',
    color: '#0000FF',
    name: 'Work',
    createdAt: currentDate,
  },
];

export const defaultActivityLogs: IActivityLog[] = [
  {
    id: '2',
    text: 'Entered GoalForge as a guest user',
    createdAt: currentDate.toString(),
  },
];
