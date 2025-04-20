import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  fullName: string | null;
}

export function ProfileAvatar({ avatarUrl, fullName }: ProfileAvatarProps) {
  return (
    <div className="flex justify-center mb-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>{fullName?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
    </div>
  );
}