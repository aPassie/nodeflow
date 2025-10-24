import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { UserCard } from "@/components/UserCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Users as UsersIcon } from "lucide-react";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";

export default function Users() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (user?.inviteCode) {
      navigator.clipboard.writeText(user.inviteCode);
      toast.success('Invite code copied to clipboard!');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user from your organization?')) {
      return;
    }

    try {
      await userAPI.deleteUser(userId);
      toast.success('User removed successfully');
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove user');
    }
  };

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
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Members</h1>
          <p className="text-muted-foreground">Manage your organization members</p>
        </div>

        {user?.role === 'admin' && user?.inviteCode && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Invite Team Members
              </CardTitle>
              <CardDescription>
                Share this code with team members to join your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-mono text-3xl font-bold tracking-widest text-primary">
                    {user.inviteCode}
                  </div>
                </div>
                <Button onClick={copyInviteCode} variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {users.length} {users.length === 1 ? 'Member' : 'Members'}
            </h2>
          </div>
          
          {users.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {users.map((u) => (
                <UserCard 
                  key={u._id || u.email} 
                  name={u.name}
                  email={u.email}
                  role={u.role}
                  joinDate={new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  userId={u._id}
                  currentUserRole={user?.role}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No team members yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
