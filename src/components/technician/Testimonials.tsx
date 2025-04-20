import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Testimonials</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "RepairJunction has made my work so much easier! No more back-and-forth with customers, everything is automated."
              </p>
              <p className="font-semibold">– Mike R.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "I can track all my repairs in one place and focus on fixing instead of managing."
              </p>
              <p className="font-semibold">– Sophia T.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}