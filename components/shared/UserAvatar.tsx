// components/shared/UserAvatar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  src?: string | null;
  fallback: string;
  className?: string;
};

export function UserAvatar({ src, fallback, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarImage src={src ?? ""} alt="User avatar" />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}