import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { TaskCard } from "@/components/TaskCard";
import { ListTodo, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { taskAPI } from "@/lib/api";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await taskAPI.getDashboardData();
      setDashboardData(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: "Total Tasks", value: dashboardData.summary.totalTasks || 0, icon: ListTodo, color: "primary" as const },
    { title: "Completed", value: dashboardData.summary.completedTasks || 0, icon: CheckCircle2, color: "success" as const },
    { title: "In Progress", value: dashboardData.summary.inProgressTasks || 0, icon: Clock, color: "warning" as const },
    { title: "Pending", value: dashboardData.summary.pendingTasks || 0, icon: AlertCircle, color: "info" as const },
  ];

  const pieData = [
    { name: "Completed", value: dashboardData.statusDistribution.completed || 0, color: "hsl(var(--status-completed))" },
    { name: "In Progress", value: dashboardData.statusDistribution.inProgress || 0, color: "hsl(var(--status-in-progress))" },
    { name: "Pending", value: dashboardData.statusDistribution.pending || 0, color: "hsl(var(--status-pending))" },
  ];

  const barData = [
    { name: "High", value: dashboardData.priorityDistribution.high || 0, fill: "hsl(var(--priority-high))" },
    { name: "Medium", value: dashboardData.priorityDistribution.medium || 0, fill: "hsl(var(--priority-medium))" },
    { name: "Low", value: dashboardData.priorityDistribution.low || 0, fill: "hsl(var(--priority-low))" },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Task Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Priority Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Tasks</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dashboardData.recentTasks && dashboardData.recentTasks.length > 0 ? (
              dashboardData.recentTasks.map((task: any) => (
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
              ))
            ) : (
              <p className="text-muted-foreground col-span-full text-center py-8">No recent tasks found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
