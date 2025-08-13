"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Mock login - in a real app, you'd call an API
      toast({
        title: "Login Successful",
        description: "Welcome to the Admin Panel!",
      });
      setIsLoggedIn(true);
      // In a real app, you'd likely redirect to a dashboard
      // For now, we'll just show the dashboard content on the same page
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please enter both email and password.",
      });
    }
  };

  if (isLoggedIn) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Welcome to the Go Swami Defence Academy admin panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>From here you can manage students, content, and more.</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">View and manage student profiles and progress.</p>
                    <Button asChild>
                        <Link href="/admin/students">View Students</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Content Management</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground mb-4">Create and edit quiz questions and resource links.</p>
                    <Button disabled>Manage Content (Coming Soon)</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
