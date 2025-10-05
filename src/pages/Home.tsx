import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types/task';
import { getTasks, updateTask, deleteTask as deleteTaskFromStorage } from '@/lib/storage';
import { filterTasksByToday, filterTasksByWeek } from '@/lib/taskUtils';
import TaskCard from '@/components/TaskCard';
import TaskDetailsDialog from '@/components/TaskDetailsDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, CalendarDays, LayoutList } from 'lucide-react';
import { toast } from 'sonner';

type FilterType = 'all' | 'today' | 'week';

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  };

  const getFilteredTasks = (): Task[] => {
    switch (filter) {
      case 'today':
        return filterTasksByToday(tasks);
      case 'week':
        return filterTasksByWeek(tasks);
      default:
        return tasks;
    }
  };

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    updateTask(taskId, { completed: !task.completed });
    loadTasks();
    toast.success(task.completed ? 'Task marked as pending' : 'Task completed!');
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    
    deleteTaskFromStorage(taskToDelete.id);
    loadTasks();
    setTaskToDelete(null);
    setSelectedTask(null);
    toast.success('Task deleted successfully');
  };

  const handleEditTask = (task: Task) => {
    navigate('/add-task', { state: { task } });
  };

  const filteredTasks = getFilteredTasks();
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          My Tasks
        </h1>
        <p className="text-muted-foreground">
          Manage and organize your tasks efficiently
        </p>
      </div>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all" className="gap-2">
            <LayoutList className="w-4 h-4" />
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="today" className="gap-2">
            <Calendar className="w-4 h-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="gap-2">
            <CalendarDays className="w-4 h-4" />
            This Week
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
            <LayoutList className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No tasks yet</h2>
          <p className="text-muted-foreground mb-6">
            Start organizing your life by creating your first task
          </p>
          <Button 
            onClick={() => navigate('/add-task')}
            className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
          >
            Create Your First Task
          </Button>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">No tasks found</h2>
          <p className="text-muted-foreground">
            {filter === 'today' && 'No tasks scheduled for today'}
            {filter === 'week' && 'No tasks scheduled for this week'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={(id) => setTaskToDelete(tasks.find(t => t.id === id) || null)}
              onEdit={handleEditTask}
              onClick={() => setSelectedTask(task)}
            />
          ))}
        </div>
      )}

      <TaskDetailsDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onToggleComplete={handleToggleComplete}
        onDelete={(id) => {
          setTaskToDelete(tasks.find(t => t.id === id) || null);
        }}
        onEdit={handleEditTask}
      />

      <DeleteConfirmDialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        taskTitle={taskToDelete?.title || ''}
      />
    </div>
  );
};

export default Home;
