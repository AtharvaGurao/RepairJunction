
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ClipboardList, BarChart3, FileText, History } from "lucide-react";

export default function TechnicianServices() {
  const services = [
    {
      title: "Request Management",
      link: "/technician/requests",
      icon: ClipboardList,
      description: "View and manage all incoming repair requests",
      color: "primary"
    },
    {
      title: "Tracking Management",
      link: "/technician/tracking",
      icon: BarChart3,
      description: "Update repair statuses and track progress",
      color: "accent"
    },
    {
      title: "Quotation Management",
      link: "/technician/quotations",
      icon: FileText,
      description: "Create and manage repair quotations",
      color: "secondary"
    },
    {
      title: "Service History",
      link: "/technician/service-history",
      icon: History,
      description: "View completed repairs and service records",
      color: "primary"
    },
  ];

  return (
    <div className="section-container">
      <h1 className="text-3xl font-bold text-center mb-2">Technician Services</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Manage all your repair operations from one central dashboard
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {services.map((service, index) => (
          <Link key={service.title} to={service.link}>
            <Card className={`card-animation border-l-4 ${service.color === 'primary' ? 'border-l-primary' : service.color === 'accent' ? 'border-l-accent' : 'border-l-secondary'} h-full`}>
              <CardHeader className={`bg-gradient-to-r ${service.color === 'primary' ? 'from-primary/5' : service.color === 'accent' ? 'from-accent/5' : 'from-secondary/5'} to-transparent pb-4`}>
                <CardTitle className="flex items-center">
                  <span className={`${service.color === 'primary' ? 'bg-primary/10' : service.color === 'accent' ? 'bg-accent/10' : 'bg-secondary/10'} p-2 rounded-full mr-3`}>
                    <service.icon className={`h-5 w-5 ${service.color === 'primary' ? 'text-primary' : service.color === 'accent' ? 'text-accent' : 'text-secondary'}`} />
                  </span>
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col justify-between h-32">
                <p className="text-muted-foreground">{service.description}</p>
                <div className="mt-4 self-end">
                  <span className={`text-sm font-medium ${service.color === 'primary' ? 'text-primary' : service.color === 'accent' ? 'text-accent' : 'text-secondary'} flex items-center`}>
                    Manage
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
