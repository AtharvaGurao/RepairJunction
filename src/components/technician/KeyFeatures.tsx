import { Bell, CheckCircle, ChartBar, DollarSign } from "lucide-react";

export function KeyFeatures() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Repair Job Management</h3>
              <p className="text-muted-foreground">Organize and prioritize repair requests effortlessly.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Bell className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-muted-foreground">Notify customers with instant status updates.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <DollarSign className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">Get paid directly through the platform.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <ChartBar className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground">Track job completion rates, earnings, and feedback.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}