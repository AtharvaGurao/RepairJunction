import { Card, CardContent } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">About Us</h1>
      <Card className="max-w-3xl mx-auto">
        <CardContent className="space-y-6 pt-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Welcome to RepairJunction</h2>
            <p className="text-muted-foreground">
              "Your one-stop solution for all electronic appliance repair needs!"
            </p>
            <p className="text-muted-foreground">
              At RepairJunction, we are committed to delivering a seamless and efficient repair
              experience for our customers. Our team of skilled technicians and cutting-edge
              technology ensure excellence in every repair undertaken.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Our Mission</h3>
            <p className="text-muted-foreground">
              To provide transparent, reliable, and high-quality repair services while keeping our
              customers informed every step of the way. We simplify the repair process through seamless
              communication and efficient service delivery.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground">Email: support@repairjunction.com</p>
              <p className="text-muted-foreground">Phone: +1 (555) 555-0123</p>
              <p className="text-muted-foreground">Hours: 24/7 Support</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}