import { Toaster } from "@/components/ui/toaster";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { TechnicianRoute } from "./components/TechnicianRoute";
import { UserRoute } from "./components/UserRoute";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import AboutUs from "@/pages/AboutUs";
import SubmitRequest from "@/pages/SubmitRequest";
import TrackRepair from "@/pages/TrackRepair";
import Quotation from "@/pages/Quotation";
import QuotationAccepted from "@/pages/QuotationAccepted";
import QuotationRejected from "@/pages/QuotationRejected";
import SubmitSuccess from "@/pages/SubmitSuccess";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import TechnicianSignup from "@/pages/TechnicianSignup";
import TechnicianLogin from "@/pages/TechnicianLogin";
import TechnicianHome from "@/pages/TechnicianHome";
import TechnicianServices from "@/pages/TechnicianServices";
import TechnicianProfile from "@/pages/TechnicianProfile";
import MyProfile from "@/pages/MyProfile";
import TechnicianRequests from "@/pages/TechnicianRequests";
import RequestDetails from "@/pages/RequestDetails";
import PickupSchedule from "@/pages/PickupSchedule";
import QuotationManagement from "@/pages/QuotationManagement";
import QuotationSubmission from "@/pages/QuotationSubmission";
import QuotationSubmitSuccess from "@/pages/QuotationSubmitSuccess";
import TrackingManagement from "@/pages/TrackingManagement";
import TrackingUpdate from "@/pages/TrackingUpdate";
import TrackingUpdateSuccess from "@/pages/TrackingUpdateSuccess";
import TrackingAcceptUpdate from "@/pages/TrackingAcceptUpdate";
import ServiceHistory from "@/pages/ServiceHistory";
import ServiceHistoryDetails from "@/pages/ServiceHistoryDetails";
import { useAuthStatus } from "./hooks/useAuthStatus";

function App() {
  const { isAuthenticated, isTechnician, isUser, isLoading } = useAuthStatus();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Routes>
        {/* Public routes accessible to everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login/technician" element={<TechnicianLogin />} />
        <Route path="/signup/technician" element={<TechnicianSignup />} />

        {/* Public service routes */}
        <Route path="/services" element={<Services />} />
        
        {/* Protected user routes */}
        <Route path="/services/submit-request" element={<UserRoute><SubmitRequest /></UserRoute>} />
        <Route path="/services/track-repair" element={<UserRoute><TrackRepair /></UserRoute>} />
        <Route path="/services/quotation/:id" element={<UserRoute><Quotation /></UserRoute>} />
        <Route path="/services/quotation-accepted" element={<UserRoute><QuotationAccepted /></UserRoute>} />
        <Route path="/services/quotation-rejected" element={<UserRoute><QuotationRejected /></UserRoute>} />
        <Route path="/services/submit-success" element={<UserRoute><SubmitSuccess /></UserRoute>} />
        <Route path="/profile" element={<UserRoute><MyProfile /></UserRoute>} />

        {/* Protected technician routes */}
        <Route path="/technician" element={<TechnicianRoute><TechnicianHome /></TechnicianRoute>} />
        <Route path="/technician/services" element={<TechnicianRoute><TechnicianServices /></TechnicianRoute>} />
        <Route path="/technician/profile" element={<TechnicianRoute><TechnicianProfile /></TechnicianRoute>} />
        <Route path="/technician/requests" element={<TechnicianRoute><TechnicianRequests /></TechnicianRoute>} />
        <Route path="/technician/requests/:id" element={<TechnicianRoute><RequestDetails /></TechnicianRoute>} />
        <Route path="/technician/requests/:id/pickup" element={<TechnicianRoute><PickupSchedule /></TechnicianRoute>} />
        <Route path="/technician/quotations" element={<TechnicianRoute><QuotationManagement /></TechnicianRoute>} />
        <Route path="/technician/quotations/:id/submit" element={<TechnicianRoute><QuotationSubmission /></TechnicianRoute>} />
        <Route path="/technician/quotations/:id/success" element={<TechnicianRoute><QuotationSubmitSuccess /></TechnicianRoute>} />
        <Route path="/technician/tracking" element={<TechnicianRoute><TrackingManagement /></TechnicianRoute>} />
        <Route path="/technician/tracking/:id" element={<TechnicianRoute><TrackingUpdate /></TechnicianRoute>} />
        <Route path="/technician/tracking/:id/success" element={<TechnicianRoute><TrackingUpdateSuccess /></TechnicianRoute>} />
        <Route path="/technician/tracking/:id/accept" element={<TechnicianRoute><TrackingAcceptUpdate /></TechnicianRoute>} />
        <Route path="/technician/service-history" element={<TechnicianRoute><ServiceHistory /></TechnicianRoute>} />
        <Route path="/technician/service-history/:id" element={<TechnicianRoute><ServiceHistoryDetails /></TechnicianRoute>} />
        
        {/* Redirect unauthorized or unknown routes */}
        <Route path="*" element={
          isLoading ? (
            <div className="flex justify-center items-center min-h-[70vh]">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading application...</p>
              </div>
            </div>
          ) : (
            <Navigate to={isAuthenticated ? (isTechnician ? "/technician" : "/") : "/"} />
          )
        } />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
