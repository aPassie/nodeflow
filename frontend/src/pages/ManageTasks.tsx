import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download } from "lucide-react";
import { taskAPI, reportAPI } from "@/lib/api";
import { toast } from "sonner";

export default function ManageTasks() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    if (parsedUser.role !== 'admin') {
      toast.error('Only admins can manage tasks');
      navigate('/dashboard');
      return;
    }

    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAllTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await reportAPI.downloadPDF();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasks-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await reportAPI.downloadExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasks-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel downloaded successfully');
    } catch (error) {
      toast.error('Failed to download Excel');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                         task.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Tasks</h1>
            <p className="text-muted-foreground">Create, edit, and organize all tasks</p>
          </div>
          <Link to="/tasks/create">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filter === "in-progress" ? "default" : "outline"}
              onClick={() => setFilter("in-progress")}
              size="sm"
            >
              In Progress
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
              size="sm"
            >
              Completed
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadExcel}>
              <Download className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task._id} 
                id={task._id}
                title={task.title}
                description={task.description}
                status={task.status}
                priority={task.priority}
                dueDate={task.dueDate}
                assignedUsers={task.assignedTo?.map((u: any) => ({ name: u.name })) || []}
                progress={task.todoList?.length ? (task.todoList.filter((t: any) => t.completed).length / task.todoList.length) * 100 : 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}
      </main>
    </div>
  );
}
