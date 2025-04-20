import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ClipboardEdit, FileSearch, FileText } from "lucide-react";

const Services = () => {
  return (
    <div className="section-container">
      <h1 className="text-3xl font-bold text-center mb-2">Our Services</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Track and manage your electronic repairs through our streamlined service platform
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
        <Card className="card-animation border-l-4 border-l-primary overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
            <CardTitle className="flex items-center text-xl">
              <span className="bg-primary/10 p-2 rounded-full mr-3">
                <ClipboardEdit className="h-5 w-5 text-primary" />
              </span>
              Submit Request
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col items-center">
            <p className="text-muted-foreground mb-6 text-center">
              Start your repair journey by submitting a detailed repair request for your electronic device
            </p>
            <Link to="/services/submit-request">
              <Button size="lg" className="w-full">Submit New Repair Request</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-animation border-l-4 border-l-accent overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-accent/5 to-transparent pb-4">
            <CardTitle className="flex items-center text-xl">
              <span className="bg-accent/10 p-2 rounded-full mr-3">
                <FileSearch className="h-5 w-5 text-accent" />
              </span>
              Track Repair
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col items-center">
            <p className="text-muted-foreground mb-6 text-center">
              Monitor the status and progress of your ongoing repair requests in real-time
            </p>
            <Link to="/services/track-repair">
              <Button size="lg" variant="accent" className="w-full">Track Your Repair Status</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="card-animation border-l-4 border-l-secondary max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-secondary/5 to-transparent pb-4">
          <CardTitle className="flex items-center text-xl">
            <span className="bg-secondary/10 p-2 rounded-full mr-3">
              <FileText className="h-5 w-5 text-secondary" />
            </span>
            Quotation Approval
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col items-center">
          <p className="text-muted-foreground mb-6 text-center">
            Review and approve repair quotations to authorize work on your devices
          </p>
          <Link to="/services/quotation/44">
            <Button size="lg" variant="secondary" className="w-full">View Pending Quotations</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
