
import { Link } from "react-router-dom";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { NavLinks } from "./NavLinks";
import { AuthButton } from "./AuthButton";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, isTechnician, isUser, setIsTechnician, isLoading } = useAuthStatus();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowContent(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000); // Reduced timeout for better UX

    return () => clearTimeout(timer);
  }, [isLoading]);

  console.log("Navbar rendered with:", { isAuthenticated, isTechnician, isUser, isLoading, showContent });

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to={isAuthenticated ? (isTechnician ? "/technician" : "/") : "/"} 
              className="text-primary font-bold text-xl flex items-center"
            >
              <span className="text-accent mr-1">⚡</span>
              RepairJunction
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!showContent ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent" />
            ) : (
              <div className="flex items-center gap-5">
                <NavLinks 
                  isTechnician={isTechnician} 
                  isUser={isUser}
                  isAuthenticated={isAuthenticated} 
                />
                <AuthButton 
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                  setIsTechnician={setIsTechnician}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
