import { Task } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { getCategoryBgClass, getCategoryTextClass } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';

interface TaskDetailsDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskDetailsDialog = ({ 
  task, 
  open, 
  onOpenChange, 
  onToggleComplete, 
  onDelete, 
  onEdit 
}: TaskDetailsDialogProps) => {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <button
              onClick={() => onToggleComplete(task.id)}
              className="transition-transform hover:scale-110"
            >
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 text-[hsl(var(--success))]" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
              )}
            </button>
            <span className={cn(
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {task.description && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Description</h4>
              <p className="text-foreground whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-6">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Due Date</h4>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(task.dueDate), 'MMMM dd, yyyy')}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Category</h4>
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md w-fit",
                getCategoryBgClass(task.category),
                getCategoryTextClass(task.category)
              )}>
                <Tag className="w-4 h-4" />
                <span className="capitalize font-medium">{task.category}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Status</h4>
              <div className={cn(
                "px-3 py-1.5 rounded-md w-fit font-medium",
                task.completed 
                  ? "bg-[hsl(var(--success)_/_0.1)] text-[hsl(var(--success))]"
                  : "bg-accent text-accent-foreground"
              )}>
                {task.completed ? 'Completed' : 'Pending'}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button
              onClick={() => {
                onEdit(task);
                onOpenChange(false);
              }}
              className="flex-1 gap-2"
              variant="outline"
            >
              <Edit className="w-4 h-4" />
              Edit Task
            </Button>
            <Button
              onClick={() => {
                onDelete(task.id);
                onOpenChange(false);
              }}
              className="flex-1 gap-2"
              variant="destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
