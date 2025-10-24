import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { taskAPI, userAPI } from "@/lib/api";

export default function CreateTask() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [todos, setTodos] = useState([{ id: 1, text: "", completed: false }]);
  const [attachments, setAttachments] = useState([{ id: 1, name: "", url: "" }]);

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
      toast.error('Only admins can create tasks');
      navigate('/dashboard');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setAvailableUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const addTodo = () => {
    setTodos([...todos, { id: Date.now(), text: "", completed: false }]);
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: number, text: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)));
  };

  const addAttachment = () => {
    setAttachments([...attachments, { id: Date.now(), name: "", url: "" }]);
  };

  const removeAttachment = (id: number) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };

  const updateAttachment = (id: number, field: "name" | "url", value: string) => {
    setAttachments(attachments.map((att) => (att.id === id ? { ...att, [field]: value } : att)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty todos and attachments
      const todoList = todos
        .filter(todo => todo.text.trim() !== '')
        .map(({ text, completed }) => ({ text, completed }));
      
      const filteredAttachments = attachments
        .filter(att => att.name.trim() !== '' && att.url.trim() !== '')
        .map(({ name, url }) => ({ name, url }));

      const taskData = {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        todoList,
        attachments: filteredAttachments
      };

      await taskAPI.createTask(taskData);
      toast.success("Task created successfully!");
      navigate("/tasks/manage");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Task</h1>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
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

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="[&::-webkit-calendar-picker-indicator]:invert-[.85] [&::-webkit-calendar-picker-indicator]:sepia-[.15] [&::-webkit-calendar-picker-indicator]:brightness-[1.2]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <div className="space-y-2">
                    {availableUsers.length > 0 ? (
                      availableUsers.map((u) => (
                        <div key={u._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={u._id}
                            checked={assignedTo.includes(u._id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAssignedTo([...assignedTo, u._id]);
                              } else {
                                setAssignedTo(assignedTo.filter((id) => id !== u._id));
                              }
                            }}
                          />
                          <Label htmlFor={u._id} className="cursor-pointer">
                            {u.name} ({u.email})
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No users available</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Todo Checklist</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addTodo}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {todos.map((todo) => (
                      <div key={todo.id} className="flex gap-2">
                        <Input
                          placeholder="Todo item"
                          value={todo.text}
                          onChange={(e) => updateTodo(todo.id, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTodo(todo.id)}
                          disabled={todos.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Attachments</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addAttachment}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Attachment
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {attachments.map((att) => (
                      <div key={att.id} className="flex gap-2">
                        <Input
                          placeholder="Name"
                          value={att.name}
                          onChange={(e) => updateAttachment(att.id, "name", e.target.value)}
                        />
                        <Input
                          placeholder="URL"
                          value={att.url}
                          onChange={(e) => updateAttachment(att.id, "url", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAttachment(att.id)}
                          disabled={attachments.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Creating..." : "Create Task"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/tasks/manage")} disabled={loading}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}
