import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, LayoutDashboard, ListTodo, Users } from "lucide-react";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: "admin" | "user";
  };
}

export const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary">
            <span className="text-lg font-bold text-primary-foreground">N</span>
          </div>
          <span className="text-xl font-bold text-primary">
            NodeFlow
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            {user.role === "admin" && (
              <>
                <Link to="/tasks/manage">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ListTodo className="h-4 w-4" />
                    Manage Tasks
                  </Button>
                </Link>
                <Link to="/users">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    Users
                  </Button>
                </Link>
              </>
            )}
            {user.role === "user" && (
              <Link to="/tasks/my-tasks">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ListTodo className="h-4 w-4" />
                  My Tasks
                </Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};
