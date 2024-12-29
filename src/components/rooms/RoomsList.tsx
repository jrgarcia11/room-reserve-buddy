import { RoomCard } from "@/components/RoomCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Room } from "@/integrations/supabase/types";

interface RoomsListProps {
  rooms: Room[] | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const RoomsList = ({ rooms, isLoading, isAuthenticated }: RoomsListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rooms?.map((room) => (
        <RoomCard
          key={room.id}
          id={room.id}
          name={room.name}
          description={room.description || ""}
          capacity={room.capacity}
          equipment={room.equipment || []}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
};