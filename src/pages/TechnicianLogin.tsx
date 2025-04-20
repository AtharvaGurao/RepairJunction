import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Wrench, ChevronRight } from "lucide-react";

export default function TechnicianLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, attempt to sign in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Then check if the user has the technician role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData.role !== 'technician') {
        // If not a technician, sign out and show error
        await supabase.auth.signOut();
        throw new Error('Access denied. Please use the regular user login if you are not a technician.');
      }

      // Check if this is the first login by checking if essential profile fields are filled
      const { data: completedProfile, error: completedProfileError } = await supabase
        .from('profiles')
        .select('phone_number, address, flat_no_house_no, city_town, state, pincode')
        .eq('id', authData.user.id)
        .single();
      
      if (completedProfileError) {
        console.error("Error checking profile completion:", completedProfileError);
      }
      
      // Check if essential fields are missing
      const isFirstLogin = !completedProfile?.phone_number || 
                          !completedProfile?.flat_no_house_no || 
                          !completedProfile?.city_town || 
                          !completedProfile?.state || 
                          !completedProfile?.pincode;

      toast({
        title: "Success!",
        description: isFirstLogin 
          ? "Please complete your profile to continue" 
          : "You have been logged in as a technician.",
      });

      // Redirect based on whether it's first login
      if (isFirstLogin) {
        navigate('/technician/profile?firstTime=true');
      } else {
        navigate('/technician'); // Technicians go to the technician home page
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-3 pb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-semibold">Technician Sign-in</CardTitle>
            </div>
            <Link 
              to="/login" 
              className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors group"
            >
              User Login
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Welcome back! Please enter your technician credentials.</p>
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
              className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign in as Technician
                </div>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have a technician account?{" "}
              <Link 
                to="/signup/technician" 
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
