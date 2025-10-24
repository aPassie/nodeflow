import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2 } from "lucide-react";

interface UserCardProps {
  name: string;
  email: string;
  role: "admin" | "user";
  joinDate: string;
  userId: string;
  currentUserRole?: "admin" | "user";
  onDelete?: (userId: string) => void;
}

export const UserCard = ({ name, email, role, joinDate, userId, currentUserRole, onDelete }: UserCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
              <Badge variant={role === "admin" ? "default" : "secondary"}>
                {role}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Joined {joinDate}</span>
            </div>
            {currentUserRole === 'admin' && role === 'user' && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                className="w-full mt-2"
                onClick={() => onDelete(userId)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove from Organization
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
