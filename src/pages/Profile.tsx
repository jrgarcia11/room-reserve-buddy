import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { UserRoomsList } from "@/components/profile/UserRoomsList";
import { UserBookingsList } from "@/components/profile/UserBookingsList";

const Profile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
        return;
      }
      setUserId(session.user.id);
    });
  }, [navigate]);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["user-bookings", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("bookings")
        .select("*, rooms(*)")
        .eq("user_id", userId)
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["user-rooms", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container px-4 max-w-4xl mx-auto">
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
          <UserRoomsList rooms={rooms} isLoading={isLoadingRooms} />
          <UserBookingsList bookings={bookings} isLoading={isLoadingBookings} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
