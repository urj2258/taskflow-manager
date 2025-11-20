import { Task } from '@/types/task';
import { Calendar, Tag, Trash2, Edit, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { getCategoryBgClass, getCategoryTextClass } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onClick?: () => void;
}

const TaskCard = ({ task, onToggleComplete, onDelete, onEdit, onClick }: TaskCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  return (
    <Card 
      className={cn(
        "group transition-all duration-300 hover:shadow-lg cursor-pointer",
        "border-border hover:border-primary/50",
        task.completed && "opacity-60"
      )}
      onClick={handleCardClick}
      style={{ boxShadow: 'var(--shadow-card)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task.id);
              }}
              className="mt-1 flex-shrink-0 transition-transform hover:scale-110"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-foreground mb-1 truncate",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                </div>

                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md",
                  getCategoryBgClass(task.category),
                  getCategoryTextClass(task.category)
                )}>
                  <Tag className="w-3.5 h-3.5" />
                  <span className="capitalize font-medium">{task.category}</span>
                </div>

                <Badge
                  variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {task.priority}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-accent hover:text-accent-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
