import { Task, Note } from '@/types/task';

const TASKS_STORAGE_KEY = 'personal-task-manager-tasks';
const NOTES_STORAGE_KEY = 'personal-task-manager-notes';
const SETTINGS_STORAGE_KEY = 'personal-task-manager-settings';
const AUTH_STORAGE_KEY = 'personal-task-manager-auth';

// Task Storage
export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem(TASKS_STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
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

export const clearAllTasks = (): void => {
  saveTasks([]);
};

// Notes Storage
export const getNotes = (): Note[] => {
  try {
    const notes = localStorage.getItem(NOTES_STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

export const addNote = (note: Note): Note[] => {
  const notes = getNotes();
  const newNotes = [...notes, note];
  saveNotes(newNotes);
  return newNotes;
};

export const updateNote = (noteId: string, updates: Partial<Note>): Note[] => {
  const notes = getNotes();
  const newNotes = notes.map(note =>
    note.id === noteId ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
  );
  saveNotes(newNotes);
  return newNotes;
};

export const deleteNote = (noteId: string): Note[] => {
  const notes = getNotes();
  const newNotes = notes.filter(note => note.id !== noteId);
  saveNotes(newNotes);
  return newNotes;
};

// Settings Storage
export interface AppSettings {
  theme: 'light' | 'dark';
  accentColor: string;
}

export const getSettings = (): AppSettings => {
  try {
    const settings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return settings ? JSON.parse(settings) : { theme: 'light', accentColor: 'purple' };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { theme: 'light', accentColor: 'purple' };
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Auth Storage
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
};

export const setAuthenticated = (value: boolean): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, value ? 'true' : 'false');
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
