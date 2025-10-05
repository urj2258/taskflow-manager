import { Task } from '@/types/task';

const STORAGE_KEY = 'personal-task-manager-tasks';

export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const addTask = (task: Task): Task[] => {
  const tasks = getTasks();
  const newTasks = [...tasks, task];
  saveTasks(newTasks);
  return newTasks;
};

export const updateTask = (taskId: string, updates: Partial<Task>): Task[] => {
  const tasks = getTasks();
  const newTasks = tasks.map(task => 
    task.id === taskId ? { ...task, ...updates } : task
  );
  saveTasks(newTasks);
  return newTasks;
};

export const deleteTask = (taskId: string): Task[] => {
  const tasks = getTasks();
  const newTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(newTasks);
  return newTasks;
};
