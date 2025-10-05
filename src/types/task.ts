export type TaskCategory = 'work' | 'personal' | 'health' | 'other';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  category: TaskCategory;
}
