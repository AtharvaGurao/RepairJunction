
import { Link } from "react-router-dom";

interface NavLinksProps {
  isTechnician: boolean;
  isUser: boolean;
  isAuthenticated: boolean;
}

export const NavLinks = ({ isTechnician, isUser, isAuthenticated }: NavLinksProps) => {
  console.log("NavLinks rendered with:", { isTechnician, isUser, isAuthenticated });

  // Public navigation links always visible
  const publicLinks = (
    <Link to="/about" className="text-secondary hover:text-primary transition-colors">
      About Us
    </Link>
  );

  if (!isAuthenticated) {
    return (
      <>
        <Link to="/services" className="text-secondary hover:text-primary transition-colors">
          Services
        </Link>
        {publicLinks}
      </>
    );
  }

  // Technician specific navigation
  if (isTechnician) {
    return (
      <>
        <Link to="/technician" className="text-secondary hover:text-primary transition-colors">
          Home
        </Link>
        <Link to="/technician/services" className="text-secondary hover:text-primary transition-colors">
          Services
        </Link>
        <Link to="/technician/requests" className="text-secondary hover:text-primary transition-colors">
          Requests
        </Link>
        <Link to="/technician/quotations" className="text-secondary hover:text-primary transition-colors">
          Quotations
        </Link>
        <Link to="/technician/tracking" className="text-secondary hover:text-primary transition-colors">
          Tracking
        </Link>
        <Link to="/technician/service-history" className="text-secondary hover:text-primary transition-colors">
          History
        </Link>
        <Link to="/technician/profile" className="text-secondary hover:text-primary transition-colors">
          My Profile
        </Link>
        {publicLinks}
      </>
    );
  }

  // Regular user navigation
  if (isUser) {
    return (
      <>
        <Link to="/services" className="text-secondary hover:text-primary transition-colors">
          Services
        </Link>
        <Link to="/services/track-repair" className="text-secondary hover:text-primary transition-colors">
          Track Repair
        </Link>
        {publicLinks}
        <Link to="/profile" className="text-secondary hover:text-primary transition-colors">
          My Profile
        </Link>
      </>
    );
  }

  // Fallback for authenticated but role not determined yet
  return (
    <>
      <Link to="/services" className="text-secondary hover:text-primary transition-colors">
        Services
      </Link>
      {publicLinks}
    </>
  );
};
