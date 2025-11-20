import { useState, useEffect } from 'react';
import { getTasks, updateTask, deleteTask as deleteTaskFromStorage } from '@/lib/storage';
import { Task, TaskCategory } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/TaskCard';
import TaskDetailsDialog from '@/components/TaskDetailsDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Briefcase, User, GraduationCap, ShoppingCart, Dumbbell, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Categories = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  };

  const categories = [
    {
      id: 'work' as TaskCategory,
      name: 'Work',
      icon: Briefcase,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      id: 'personal' as TaskCategory,
      name: 'Personal',
      icon: User,
      color: 'bg-green-500',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-950/30',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      id: 'study' as TaskCategory,
      name: 'Study',
      icon: GraduationCap,
      color: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-950/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      id: 'shopping' as TaskCategory,
      name: 'Shopping',
      icon: ShoppingCart,
      color: 'bg-pink-500',
      lightBg: 'bg-pink-50',
      darkBg: 'dark:bg-pink-950/30',
      borderColor: 'border-pink-200 dark:border-pink-800',
    },
    {
      id: 'fitness' as TaskCategory,
      name: 'Fitness',
      icon: Dumbbell,
      color: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      darkBg: 'dark:bg-orange-950/30',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
  ];

  const getCategoryTasks = (categoryId: TaskCategory) => {
    return tasks.filter(t => t.category === categoryId);
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

  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory)!;
    const categoryTasks = getCategoryTasks(selectedCategory);
    const Icon = category.icon;

    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedCategory(null)}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1">{category.name}</h1>
              <p className="text-muted-foreground">
                {categoryTasks.length} {categoryTasks.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>
          </div>
        </div>

        {categoryTasks.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <Icon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-6">
                Create a new task in the {category.name.toLowerCase()} category
              </p>
              <Button
                onClick={() => navigate('/add-task')}
                className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
              >
                Add Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {categoryTasks.map(task => (
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
          onDelete={(id) => setTaskToDelete(tasks.find(t => t.id === id) || null)}
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
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Categories
        </h1>
        <p className="text-muted-foreground">
          Organize your tasks by category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const categoryTasks = getCategoryTasks(category.id);
          const completedCount = categoryTasks.filter(t => t.completed).length;

          return (
            <Card
              key={category.id}
              className={`border-2 ${category.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${category.lightBg} ${category.darkBg}`}
              onClick={() => setSelectedCategory(category.id)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {categoryTasks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-2">{category.name}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {completedCount} of {categoryTasks.length} completed
                </div>
                {categoryTasks.length > 0 && (
                  <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} transition-all duration-500`}
                      style={{
                        width: `${(completedCount / categoryTasks.length) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
