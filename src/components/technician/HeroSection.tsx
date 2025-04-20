import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export function HeroSection() {
  const { isAuthenticated, isTechnician } = useAuthStatus();

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-8 items-center relative">
        <div className="z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            🛠️ Streamline Your Repair Workflow with Ease
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Manage repair requests, update statuses, and communicate with customers—all in one place. 
            Join RepairJunction and simplify your repair tracking process.
          </p>
          <div className="space-x-4">
            {!isAuthenticated && (
              <>
                <Button asChild size="lg">
                  <Link to="/signup/technician">🚀 Join as a Technician</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/technician/login">📂 Log In</Link>
                </Button>
              </>
            )}
            {isAuthenticated && isTechnician && (
              <Button asChild size="lg">
                <Link to="/technician/services">🔧 View Services</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
          <img
            className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
            src="/uploads/92249997-9a0c-497c-94b6-21269e198fd0.png"
            alt="Technician working on appliance"
          />
        </div>
      </div>
    </section>
  );
}
