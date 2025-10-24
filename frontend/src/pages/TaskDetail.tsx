import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash2, Calendar, Users, Link as LinkIcon, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { taskAPI, userAPI } from "@/lib/api";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchTask();
    fetchUsers();
  }, [id, navigate]);

  const fetchTask = async () => {
    try {
      const response = await taskAPI.getTaskById(id!);
      setTask(response.data.task);
      setEditForm({
        title: response.data.task.title,
        description: response.data.task.description,
        priority: response.data.task.priority,
        status: response.data.task.status,
        dueDate: new Date(response.data.task.dueDate).toISOString().split('T')[0],
        assignedTo: response.data.task.assignedTo?.map((u: any) => u._id) || [],
      });
    } catch (error) {
      toast.error('Failed to fetch task');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setAvailableUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  const handleTodoToggle = async (index: number) => {
    if (!task) return;
    
    const updatedTodoList = [...task.todoList];
    updatedTodoList[index].completed = !updatedTodoList[index].completed;

    try {
      await taskAPI.updateTaskStatus(id!, { todoList: updatedTodoList });
      setTask({ ...task, todoList: updatedTodoList });
      toast.success('Todo updated');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.deleteTask(id!);
      toast.success("Task deleted successfully");
      navigate("/tasks/manage");
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleUpdate = async () => {
    try {
      await taskAPI.updateTask(id!, editForm);
      toast.success('Task updated successfully');
      setIsEditing(false);
      fetchTask();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const statusColors = {
    completed: "bg-green-500/20 text-green-400 border-green-500/30",
    "in-progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    pending: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  if (loading || !task) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const progress = task.todoList?.length 
    ? (task.todoList.filter((t: any) => t.completed).length / task.todoList.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              {isEditing ? (
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="text-3xl font-bold"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{task.title}</h1>
                  <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                    {task.status}
                  </Badge>
                  <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                    {task.priority}
                  </Badge>
                </div>
              )}
            </div>
            {user?.role === "admin" && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleUpdate}>
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                {isEditing ? (
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{task.description}</p>
                )}
              </div>

              {isEditing && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Priority</Label>
                    <Select 
                      value={editForm.priority} 
                      onValueChange={(value) => setEditForm({ ...editForm, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select 
                      value={editForm.status} 
                      onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Due Date:</span>
                    <span className="text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Progress:</span>
                    <span className="text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>

              <div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {task.assignedTo?.length > 0 ? (
                  task.assignedTo.map((assignedUser: any) => (
                    <div key={assignedUser._id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10">
                          {assignedUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{assignedUser.name}</p>
                        <p className="text-sm text-muted-foreground">{assignedUser.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No users assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          {task.todoList && task.todoList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Todo Checklist ({task.todoList.filter((t: any) => t.completed).length}/{task.todoList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.todoList.map((todo: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <Checkbox 
                        checked={todo.completed} 
                        onCheckedChange={() => handleTodoToggle(index)}
                      />
                      <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments ({task.attachments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {task.attachments.map((att: any, index: number) => (
                    <a
                      key={index}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{att.name}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
