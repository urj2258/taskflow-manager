import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks } from '@/lib/storage';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Calendar, AlertCircle } from 'lucide-react';
import { format, isPast, isFuture, isToday, differenceInDays } from 'date-fns';

const Reminders = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  };

  // Filter tasks with reminders or upcoming due dates
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const overdueTasks = upcomingTasks.filter(t => isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)));
  const todayTasks = upcomingTasks.filter(t => isToday(new Date(t.dueDate)));
  const futureTasks = upcomingTasks.filter(t => isFuture(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)));

  const getTaskUrgency = (task: Task): 'overdue' | 'today' | 'upcoming' | 'later' => {
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = differenceInDays(dueDate, new Date());

    if (isPast(dueDate) && !isToday(dueDate)) return 'overdue';
    if (isToday(dueDate)) return 'today';
    if (daysUntilDue <= 3) return 'upcoming';
    return 'later';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue':
        return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
      case 'today':
        return 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800';
      case 'upcoming':
        return 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'today':
        return <Badge className="bg-orange-500">Due Today</Badge>;
      case 'upcoming':
        return <Badge className="bg-yellow-500">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">Later</Badge>;
    }
  };

  const TaskReminderCard = ({ task }: { task: Task }) => {
    const urgency = getTaskUrgency(task);
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = differenceInDays(dueDate, new Date());

    return (
      <Card
        className={`border-2 ${getUrgencyColor(urgency)} hover:shadow-lg transition-all duration-300 cursor-pointer`}
        onClick={() => navigate('/tasks')}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getUrgencyBadge(urgency)}
                <Badge variant="outline" className="capitalize">
                  {task.priority}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{task.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(dueDate, 'MMM d, yyyy')}</span>
                </div>
                {task.reminderTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(task.reminderTime), 'h:mm a')}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {task.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              {urgency === 'overdue' ? (
                <AlertCircle className="w-6 h-6 text-red-500" />
              ) : (
                <Bell className="w-6 h-6 text-primary" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Reminders
        </h1>
        <p className="text-muted-foreground">
          Keep track of upcoming tasks and deadlines
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                  Overdue Tasks
                </p>
                <p className="text-3xl font-bold text-red-600">{overdueTasks.length}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-1">
                  Due Today
                </p>
                <p className="text-3xl font-bold text-orange-600">{todayTasks.length}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-600/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Upcoming
                </p>
                <p className="text-3xl font-bold text-blue-600">{futureTasks.length}</p>
              </div>
              <Bell className="w-10 h-10 text-blue-600/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {upcomingTasks.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-primary-glow/10 flex items-center justify-center">
              <Bell className="w-10 h-10 text-primary/50" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground mb-6">
              You have no pending tasks with reminders
            </p>
            <Button
              onClick={() => navigate('/add-task')}
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            >
              Add New Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overdue Section */}
          {overdueTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Overdue ({overdueTasks.length})
              </h2>
              <div className="space-y-3">
                {overdueTasks.map(task => (
                  <TaskReminderCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Today Section */}
          {todayTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                Due Today ({todayTasks.length})
              </h2>
              <div className="space-y-3">
                {todayTasks.map(task => (
                  <TaskReminderCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Section */}
          {futureTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Upcoming ({futureTasks.length})
              </h2>
              <div className="space-y-3">
                {futureTasks.slice(0, 10).map(task => (
                  <TaskReminderCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reminders;
