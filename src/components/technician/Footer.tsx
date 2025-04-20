import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Available Nationwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@repairjunction.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 800 123 4567</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <Facebook className="w-6 h-6 cursor-pointer hover:text-primary" />
              <Twitter className="w-6 h-6 cursor-pointer hover:text-primary" />
              <Instagram className="w-6 h-6 cursor-pointer hover:text-primary" />
              <Linkedin className="w-6 h-6 cursor-pointer hover:text-primary" />
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          © 2025 RepairJunction. All rights reserved.
        </div>
      </div>
    </footer>
  );
}