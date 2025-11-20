import { useState, useEffect } from 'react';
import { getTasks } from '@/lib/storage';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, PieChartIcon, BarChart3, Calendar } from 'lucide-react';
import { startOfMonth, endOfMonth, eachWeekOfInterval, format, isWithinInterval } from 'date-fns';

const Reports = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  // Category-wise data for pie chart
  const categoryData = [
    {
      name: 'Work',
      value: tasks.filter(t => t.category === 'work').length,
      color: '#3b82f6',
    },
    {
      name: 'Personal',
      value: tasks.filter(t => t.category === 'personal').length,
      color: '#10b981',
    },
    {
      name: 'Study',
      value: tasks.filter(t => t.category === 'study').length,
      color: '#8b5cf6',
    },
    {
      name: 'Shopping',
      value: tasks.filter(t => t.category === 'shopping').length,
      color: '#ec4899',
    },
    {
      name: 'Fitness',
      value: tasks.filter(t => t.category === 'fitness').length,
      color: '#f97316',
    },
  ].filter(item => item.value > 0);

  // Monthly completion data
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const weeksInMonth = eachWeekOfInterval({ start: monthStart, end: monthEnd });

  const weeklyCompletionData = weeksInMonth.map((weekStart, index) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
    });

    const completed = weekTasks.filter(t => t.completed).length;

    return {
      name: `Week ${index + 1}`,
      completed,
      total: weekTasks.length,
      pending: weekTasks.length - completed,
    };
  });

  // Priority distribution
  const priorityData = [
    {
      name: 'High',
      value: tasks.filter(t => t.priority === 'high').length,
      color: '#ef4444',
    },
    {
      name: 'Medium',
      value: tasks.filter(t => t.priority === 'medium').length,
      color: '#f59e0b',
    },
    {
      name: 'Low',
      value: tasks.filter(t => t.priority === 'low').length,
      color: '#22c55e',
    },
  ].filter(item => item.value > 0);

  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-1">{payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          Insights into your productivity and task completion
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Total Tasks
                </p>
                <p className="text-3xl font-bold text-blue-600">{tasks.length}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-600/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {tasks.filter(t => t.completed).length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {tasks.filter(t => !t.completed).length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-orange-600/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                  Completion Rate
                </p>
                <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
              </div>
              <PieChartIcon className="w-10 h-10 text-purple-600/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Tasks by Category
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribution of tasks across categories
            </p>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tasks by Priority
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Task distribution by priority level
            </p>
          </CardHeader>
          <CardContent>
            {priorityData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Productivity Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Monthly Productivity
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Weekly task completion for {format(now, 'MMMM yyyy')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCompletionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="completed" fill="hsl(142 76% 45%)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" fill="hsl(25 95% 53%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
