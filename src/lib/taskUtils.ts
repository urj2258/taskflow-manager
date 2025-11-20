import { Task, TaskCategory } from '@/types/task';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export const filterTasksByToday = (tasks: Task[]): Task[] => {
  const now = new Date();
  const start = startOfDay(now);
  const end = endOfDay(now);
  
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return isWithinInterval(dueDate, { start, end });
  });
};

export const filterTasksByWeek = (tasks: Task[]): Task[] => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(now, { weekStartsOn: 1 });
  
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return isWithinInterval(dueDate, { start, end });
  });
};

export const getCategoryColor = (category: TaskCategory): string => {
  const colors = {
    work: 'hsl(220, 90%, 56%)',
    personal: 'hsl(142, 76%, 45%)',
    study: 'hsl(250, 80%, 60%)',
    shopping: 'hsl(340, 82%, 52%)',
    fitness: 'hsl(25, 95%, 53%)',
  };
  return colors[category];
};

export const getCategoryBgClass = (category: TaskCategory): string => {
  const classes = {
    work: 'bg-blue-500/10',
    personal: 'bg-green-500/10',
    study: 'bg-purple-500/10',
    shopping: 'bg-pink-500/10',
    fitness: 'bg-orange-500/10',
  };
  return classes[category];
};

export const getCategoryTextClass = (category: TaskCategory): string => {
  const classes = {
    work: 'text-blue-600 dark:text-blue-400',
    personal: 'text-green-600 dark:text-green-400',
    study: 'text-purple-600 dark:text-purple-400',
    shopping: 'text-pink-600 dark:text-pink-400',
    fitness: 'text-orange-600 dark:text-orange-400',
  };
  return classes[category];
};

export const calculateProgress = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completedCount = tasks.filter(task => task.completed).length;
  return Math.round((completedCount / tasks.length) * 100);
};

export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const progress = calculateProgress(tasks);
  
  return { total, completed, pending, progress };
};
