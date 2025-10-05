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
    work: 'hsl(var(--category-work))',
    personal: 'hsl(var(--category-personal))',
    health: 'hsl(var(--category-health))',
    other: 'hsl(var(--category-other))',
  };
  return colors[category];
};

export const getCategoryBgClass = (category: TaskCategory): string => {
  const classes = {
    work: 'bg-[hsl(220_90%_56%_/_0.1)]',
    personal: 'bg-[hsl(142_76%_45%_/_0.1)]',
    health: 'bg-[hsl(25_95%_53%_/_0.1)]',
    other: 'bg-[hsl(240_5%_64%_/_0.1)]',
  };
  return classes[category];
};

export const getCategoryTextClass = (category: TaskCategory): string => {
  const classes = {
    work: 'text-[hsl(220_90%_56%)]',
    personal: 'text-[hsl(142_76%_45%)]',
    health: 'text-[hsl(25_95%_53%)]',
    other: 'text-[hsl(240_5%_64%)]',
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
