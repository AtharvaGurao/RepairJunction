import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function FAQ() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">❓ How do I get started?</h3>
            <p className="text-muted-foreground">
              🔹 Sign up, complete verification, and start accepting repair jobs.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">❓ What kind of devices can I repair?</h3>
            <p className="text-muted-foreground">
              🔹 You can specialize in mobile phones, laptops, home appliances, and more.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">❓ How do payments work?</h3>
            <p className="text-muted-foreground">
              🔹 Customers can pay online, and you receive payments securely after job completion.
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Button asChild size="lg" variant="outline">
            <Link to="/contact">📞 Contact Support</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}