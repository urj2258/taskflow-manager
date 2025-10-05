import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Task, TaskFormData } from '@/types/task';
import { addTask, updateTask } from '@/lib/storage';
import TaskForm from '@/components/TaskForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AddTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskToEdit = location.state?.task as Task | undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (formData: TaskFormData) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, formData);
      toast.success('Task updated successfully!');
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      addTask(newTask);
      toast.success('Task created successfully!');
    }
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tasks
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {taskToEdit ? 'Edit Task' : 'Add New Task'}
        </h1>
        <p className="text-muted-foreground">
          {taskToEdit 
            ? 'Update your task details below' 
            : 'Create a new task to stay organized'
          }
        </p>
      </div>

      <TaskForm
        onSubmit={handleSubmit}
        initialTask={taskToEdit}
        submitLabel={taskToEdit ? 'Update Task' : 'Create Task'}
      />
    </div>
  );
};

export default AddTask;
