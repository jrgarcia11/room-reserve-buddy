import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRoomCard } from "@/components/UserRoomCard";
import { useNavigate } from "react-router-dom";
import { Room } from "@/integrations/supabase/types/table.types";

interface UserRoomsListProps {
  rooms: Room[] | null;
  isLoading: boolean;
}

export function UserRoomsList({ rooms, isLoading }: UserRoomsListProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Your Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Your Rooms
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rooms?.length === 0 ? (
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No rooms created yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/create-room")}
            >
              Create Your First Room
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {rooms?.map((room) => (
              <UserRoomCard
                key={room.id}
                id={room.id}
                name={room.name}
                description={room.description}
                equipment={room.equipment}
                capacity={room.capacity}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}