import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignedUsers: { name: string; avatar?: string }[];
  progress: number;
}

export const TaskCard = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  assignedUsers,
  progress,
}: TaskCardProps) => {
  const statusColors = {
    completed: "bg-status-completed text-success-foreground",
    "in-progress": "bg-status-in-progress text-warning-foreground",
    pending: "bg-status-pending text-destructive-foreground",
  };

  const priorityColors = {
    high: "bg-priority-high text-destructive-foreground",
    medium: "bg-priority-medium text-warning-foreground",
    low: "bg-priority-low text-info-foreground",
  };

  return (
    <Link to={`/tasks/${id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <Badge className={priorityColors[priority]} variant="secondary">
              {priority}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{dueDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{assignedUsers.length} assigned</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-4">
          <Badge className={statusColors[status]} variant="secondary">
            {status}
          </Badge>
          <div className="flex -space-x-2">
            {assignedUsers.slice(0, 3).map((user, idx) => (
              <Avatar key={idx} className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="text-xs bg-primary/10">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {assignedUsers.length > 3 && (
              <Avatar className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="text-xs bg-muted">
                  +{assignedUsers.length - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
