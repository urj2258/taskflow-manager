import { useEffect, useState } from 'react';
import { getTasks } from '@/lib/storage';
import { Task, TaskCategory } from '@/types/task';
import { getTaskStats } from '@/lib/taskUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

const Profile = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const stats = getTaskStats(tasks);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const getCategoryStats = () => {
    const categories: TaskCategory[] = ['work', 'personal', 'health', 'other'];
    return categories.map(category => {
      const categoryTasks = tasks.filter(task => task.category === category);
      const completed = categoryTasks.filter(task => task.completed).length;
      return {
        category,
        total: categoryTasks.length,
        completed,
      };
    });
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-muted-foreground">
          Track your productivity and task completion
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--success))]">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Tasks finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Tasks remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.progress}%</div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-muted-foreground">Task Completion</span>
              <span className="font-medium">{stats.completed} / {stats.total}</span>
            </div>
            <Progress value={stats.progress} className="h-3" />
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.progress === 100 
              ? '🎉 Amazing! You\'ve completed all your tasks!' 
              : stats.progress >= 75 
              ? '🌟 Great progress! Keep it up!' 
              : stats.progress >= 50 
              ? '💪 You\'re halfway there!' 
              : stats.pending > 0 
              ? '🚀 Let\'s get started on those tasks!' 
              : 'Create your first task to start tracking progress'
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categoryStats.map(({ category, total, completed }) => {
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium capitalize">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      {completed} / {total}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
