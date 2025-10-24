import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ListTodo, Users, BarChart3, CheckCircle2 } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary">
              <span className="text-lg font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xl font-bold text-primary">
              NodeFlow
            </span>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="container py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Streamline Your Team's
              <span className="text-primary">
                {" "}Task Management
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              NodeFlow helps teams organize, track, and complete tasks efficiently with powerful
              collaboration tools and intuitive workflows.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-20 border-t">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <div className="rounded-3xl bg-primary/10 p-4">
                  <ListTodo className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Task Management</h3>
              <p className="text-muted-foreground">
                Create, assign, and track tasks with priorities and deadlines
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <div className="rounded-3xl bg-secondary/10 p-4">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together seamlessly with role-based access control
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <div className="rounded-3xl bg-success/10 p-4">
                  <BarChart3 className="h-8 w-8 text-success" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Analytics</h3>
              <p className="text-muted-foreground">
                Track progress with detailed reports and visualizations
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <div className="rounded-3xl bg-warning/10 p-4">
                  <CheckCircle2 className="h-8 w-8 text-warning" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Stay Organized</h3>
              <p className="text-muted-foreground">
                Keep everything in one place with checklists and attachments
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © 2024 NodeFlow. Built with modern technologies.
        </div>
      </footer>
    </div>
  );
};

export default Index;
