export type TaskCategory = 'work' | 'personal' | 'study' | 'shopping' | 'fitness';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
  reminderTime?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  category: TaskCategory;
  priority: TaskPriority;
  reminderTime?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
