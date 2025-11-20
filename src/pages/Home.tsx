import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types/task';
import { getTasks, updateTask, deleteTask as deleteTaskFromStorage } from '@/lib/storage';
import { filterTasksByToday, filterTasksByWeek } from '@/lib/taskUtils';
import TaskCard from '@/components/TaskCard';
import TaskDetailsDialog from '@/components/TaskDetailsDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarDays, LayoutList, CheckCircle, Search, SlidersHorizontal, Plus } from 'lucide-react';
import { toast } from 'sonner';

type FilterType = 'all' | 'today' | 'week' | 'completed';
type SortType = 'date' | 'priority' | 'category';

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  };

  const getFilteredTasks = (): Task[] => {
    let filtered: Task[] = [];

    switch (filter) {
      case 'today':
        filtered = filterTasksByToday(tasks);
        break;
      case 'week':
        filtered = filterTasksByWeek(tasks);
        break;
      case 'completed':
        filtered = tasks.filter(t => t.completed);
        break;
      default:
        filtered = tasks;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
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
    // Always put incomplete tasks first unless viewing completed
    if (filter !== 'completed' && a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then sort by selected criteria
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'category':
        return a.category.localeCompare(b.category);
      case 'date':
      default:
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            All Tasks
          </h1>
          <p className="text-muted-foreground">
            Manage and organize your tasks efficiently
          </p>
        </div>
        <Button
          onClick={() => navigate('/add-task')}
          className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)} className="mb-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 h-12">
          <TabsTrigger value="all" className="gap-2">
            <LayoutList className="w-4 h-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="today" className="gap-2">
            <Calendar className="w-4 h-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="gap-2">
            <CalendarDays className="w-4 h-4" />
            This Week
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortType)}>
          <SelectTrigger className="w-full sm:w-48 h-11">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="priority">Sort by Priority</SelectItem>
            <SelectItem value="category">Sort by Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
