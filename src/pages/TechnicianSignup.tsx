
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Wrench, UserPlus, ChevronRight } from "lucide-react";

export default function TechnicianSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign up the user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'technician',
            full_name: fullName,
            skills: skills
          }
        }
      });

      if (error) throw error;

      // Update the profile with additional fields
      // Note: We don't create a new profile, we update the existing one
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ skills })
        .eq('id', data.user!.id);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });

      navigate('/login/technician');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-3 pb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-semibold">Technician Sign-up</CardTitle>
            </div>
            <Link 
              to="/signup" 
              className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors group"
            >
              User Sign-up
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Create your technician account to start serving customers.</p>
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
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Skills/Specialization (e.g., Plumbing, Electrical)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Create Technician Account
                </div>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have a technician account?{" "}
              <Link 
                to="/login/technician" 
                className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
