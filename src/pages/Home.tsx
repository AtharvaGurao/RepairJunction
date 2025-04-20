import { Link, useNavigate } from "react-router-dom";
import { Wrench, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/useAuthStatus";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStatus();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/services");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Wrench className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-4">
            Welcome to RepairJunction
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Restoring your appliances, restoring your life - reliable repairs, trusted service.
          </p>
          <Button 
            size="lg" 
            className="bg-primary"
            onClick={handleGetStarted}
          >
            {isAuthenticated ? "Explore Our Services" : "📂 Get Started"}
          </Button>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works (3-Step Process)</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-blue-50">
              <div className="text-2xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">1. Submit a Repair Request</h3>
              <p className="text-gray-600">Enter your appliance details and issue, and get matched with a verified repair service.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50">
              <div className="text-2xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">2. Track Your Repair in Real-Time</h3>
              <p className="text-gray-600">Stay updated with repair progress, technician details, and estimated completion time.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50">
              <div className="text-2xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">3. Get Notified & Pick Up Your Device</h3>
              <p className="text-gray-600">Receive alerts when your appliance is ready for pickup or delivery.</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="bg-primary"
              onClick={handleGetStarted}
            >
              📂 Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Real-Time Tracking: Know the exact status of your repair.",
              "Verified Service Providers: Get repairs from trusted technicians.",
              "Secure Payment Options: Pay online securely or after service.",
              "Warranty & Support: Extended warranty on repairs and customer support."
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                <p className="text-gray-700"><span className="text-primary mr-2">✔️</span>{feature}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" className="gap-2">
              <Phone className="h-5 w-5" />
              Talk to an Expert
            </Button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-yellow-400 mb-4">⭐ ⭐ ⭐ ⭐ ⭐</div>
              <p className="text-gray-700 mb-4">"RepairJunction made it so easy to track my laptop repair. The updates were super helpful!"</p>
              <p className="font-semibold">– John D.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-yellow-400 mb-4">⭐ ⭐ ⭐ ⭐ ⭐</div>
              <p className="text-gray-700 mb-4">"I love how transparent and quick the service is. No more guessing when my phone will be fixed!"</p>
              <p className="font-semibold">– Sarah K.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Partner with Us</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Are you a repair shop? Join RepairJunction and grow your business with online repair management and customer tracking.
          </p>
          <Link to="/signup/technician">
            <Button size="lg" variant="outline">
              🔗 Register as a Partner
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <p className="mb-2">📍 Location: Available Nationwide</p>
              <p className="mb-2">📧 Email: support@repairjunction.com</p>
              <p>📞 Contact: +1 800 123 4567</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 cursor-pointer hover:text-blue-400" />
                <Twitter className="h-6 w-6 cursor-pointer hover:text-blue-400" />
                <Instagram className="h-6 w-6 cursor-pointer hover:text-blue-400" />
                <Linkedin className="h-6 w-6 cursor-pointer hover:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>© 2025 RepairJunction. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
