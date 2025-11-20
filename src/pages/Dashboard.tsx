import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks } from '@/lib/storage';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle2, Circle, Calendar, TrendingUp, Plus, ListTodo } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const tasksToday = tasks.filter(t => isToday(new Date(t.dueDate))).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Weekly data for chart
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyData = daysOfWeek.map(day => {
    const dayTasks = tasks.filter(t => {
      const taskDate = new Date(t.dueDate);
      return format(taskDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    const completed = dayTasks.filter(t => t.completed).length;
    const pending = dayTasks.length - completed;

    return {
      name: format(day, 'EEE'),
      completed,
      pending,
      total: dayTasks.length,
    };
  });

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-950/30',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-950/30',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Circle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      darkBgColor: 'dark:bg-orange-950/30',
    },
    {
      title: 'Due Today',
      value: tasksToday,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      darkBgColor: 'dark:bg-purple-950/30',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your productivity and progress
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-xl ${stat.bgColor} ${stat.darkBgColor} flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Activity Chart */}
      <Card className="border-0 shadow-lg mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Weekly Activity</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tasks overview for this week
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary">{completionRate}% Complete</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-sm"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-sm"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Legend />
                <Bar
                  dataKey="completed"
                  fill="hsl(142 76% 45%)"
                  radius={[8, 8, 0, 0]}
                  name="Completed"
                />
                <Bar
                  dataKey="pending"
                  fill="hsl(25 95% 53%)"
                  radius={[8, 8, 0, 0]}
                  name="Pending"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate('/tasks')}
              variant="outline"
              className="h-20 text-left justify-start p-6 hover:bg-accent hover:border-primary/50 transition-all duration-300"
            >
              <div>
                <p className="font-semibold mb-1">View All Tasks</p>
                <p className="text-xs text-muted-foreground">See your complete task list</p>
              </div>
            </Button>
            <Button
              onClick={() => navigate('/categories')}
              variant="outline"
              className="h-20 text-left justify-start p-6 hover:bg-accent hover:border-primary/50 transition-all duration-300"
            >
              <div>
                <p className="font-semibold mb-1">Categories</p>
                <p className="text-xs text-muted-foreground">Organize by category</p>
              </div>
            </Button>
            <Button
              onClick={() => navigate('/calendar')}
              variant="outline"
              className="h-20 text-left justify-start p-6 hover:bg-accent hover:border-primary/50 transition-all duration-300"
            >
              <div>
                <p className="font-semibold mb-1">Calendar View</p>
                <p className="text-xs text-muted-foreground">See tasks by date</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
