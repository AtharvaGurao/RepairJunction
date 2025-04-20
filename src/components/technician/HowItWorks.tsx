import { Bell, MessageSquare, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works (For Technicians)</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <Bell className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">📥 Receive Repair Requests</h3>
              <p className="text-muted-foreground">
                Get assigned repair jobs based on your expertise and location.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Wrench className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">🔧 Update Repair Status</h3>
              <p className="text-muted-foreground">
                Easily log diagnostics, repair progress, and estimated completion times.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <MessageSquare className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">📢 Notify Customers</h3>
              <p className="text-muted-foreground">
                Send automatic updates and alerts when repairs are completed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}