import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { UserRoomsList } from "@/components/profile/UserRoomsList";
import { UserBookingsList } from "@/components/profile/UserBookingsList";
import { PageLayout } from "@/components/layout/PageLayout";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { fetchProfile } from "@/services/profiles";
import { fetchUserRooms } from "@/services/rooms";
import { fetchUserBookings } from "@/services/bookings";

const Profile = () => {
  const navigate = useNavigate();
  const { userId, isLoading: authLoading } = useRequireAuth();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
  });

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["user-bookings", userId],
    queryFn: () => fetchUserBookings(userId!),
    enabled: !!userId,
  });

  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["user-rooms", userId],
    queryFn: () => fetchUserRooms(userId!),
    enabled: !!userId,
  });

  if (authLoading || !userId) {
    return null;
  }

  return (
    <PageLayout className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button onClick={() => navigate("/create-room")}>
          <Plus className="h-5 w-5 mr-2" />
          Create Room
        </Button>
      </div>
      <div className="space-y-8">
        <ProfileInfo profile={profile} isLoading={isLoadingProfile} />
        <UserRoomsList rooms={rooms ?? null} isLoading={isLoadingRooms} />
        <UserBookingsList bookings={bookings ?? null} isLoading={isLoadingBookings} />
      </div>
    </PageLayout>
  );
};

export default Profile;