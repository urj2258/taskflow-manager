import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, updateTask, deleteTask as deleteTaskFromStorage } from '@/lib/storage';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import TaskCard from '@/components/TaskCard';
import TaskDetailsDialog from '@/components/TaskDetailsDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { format, isSameDay } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

const CalendarView = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task =>
      isSameDay(new Date(task.dueDate), date)
    );
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

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

  // Get dates with tasks for calendar highlighting
  const datesWithTasks = tasks.map(task => new Date(task.dueDate));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Calendar
        </h1>
        <p className="text-muted-foreground">
          View your tasks organized by date
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="lg:col-span-1 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-xl border shadow-sm"
              modifiers={{
                hasTask: datesWithTasks,
              }}
              modifiersStyles={{
                hasTask: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textDecorationColor: 'hsl(var(--primary))',
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Tasks for Selected Date */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-1">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>
              <Badge
                variant={selectedDateTasks.length > 0 ? 'default' : 'secondary'}
                className="text-base px-4 py-1"
              >
                {selectedDateTasks.filter(t => t.completed).length} / {selectedDateTasks.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-primary-glow/10 flex items-center justify-center">
                  <CalendarDays className="w-10 h-10 text-primary/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No tasks for this date</h3>
                <p className="text-muted-foreground">
                  Select another date or create a new task
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {selectedDateTasks
                  .sort((a, b) => {
                    if (a.completed !== b.completed) return a.completed ? 1 : -1;
                    return a.priority === 'high' ? -1 : 1;
                  })
                  .map(task => (
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
          </CardContent>
        </Card>
      </div>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {tasks.length}
            </div>
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total Tasks
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {tasks.filter(t => t.completed).length}
            </div>
            <div className="text-sm font-medium text-green-900 dark:text-green-100">
              Completed Tasks
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {tasks.filter(t => !t.completed).length}
            </div>
            <div className="text-sm font-medium text-orange-900 dark:text-orange-100">
              Pending Tasks
            </div>
          </CardContent>
        </Card>
      </div>

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
};

export default CalendarView;
