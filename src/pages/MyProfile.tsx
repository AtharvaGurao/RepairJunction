import { useLocation } from "react-router-dom";
import { ProfileContainer } from "@/components/profile/ProfileContainer";

export default function MyProfile() {
  const location = useLocation();
  const isFirstTime = new URLSearchParams(location.search).get('firstTime') === 'true';

  return (
    <div className="container max-w-2xl mx-auto p-4 mt-8">
      <ProfileContainer isFirstTime={isFirstTime} />
    </div>
  );
}