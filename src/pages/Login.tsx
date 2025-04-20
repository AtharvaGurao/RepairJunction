import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { LogIn, User, ChevronRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Check if profile exists and has the correct role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData.role === 'technician') {
        // If a technician tries to use regular login, sign them out
        await supabase.auth.signOut();
        throw new Error('Please use the technician login page if you are a technician.');
      }

      // If profile doesn't exist or is incomplete, redirect to profile page
      if (!profileData?.full_name) {
        toast({
          title: "Welcome!",
          description: "Please complete your profile to continue.",
        });
        navigate('/profile?firstTime=true');
      } else {
        toast({
          title: "Success!",
          description: "You have been logged in.",
        });
        navigate('/'); // Regular users go to the home page
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      
      // Ensure user is signed out in case of role mismatch
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-3 pb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-semibold">User Sign-in</CardTitle>
            </div>
            <Link 
              to="/login/technician" 
              className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors group"
            >
              Technician Login
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Welcome back! Please enter your details.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign in
                </div>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
