import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileInfoProps {
  profile: { username: string } | null;
  isLoading: boolean;
}

export function ProfileInfo({ profile, isLoading }: ProfileInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {profile?.username?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium">
                {profile?.username ?? "No username set"}
              </h3>
              <p className="text-sm text-muted-foreground">User Profile</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}