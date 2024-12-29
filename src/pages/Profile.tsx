import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowLeft, Plus, Clock, Building, Music } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

type Booking = Tables<"bookings"> & {
  rooms: Tables<"rooms">;
};

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
      return data as Booking[];
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

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container px-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button onClick={() => navigate("/create-room")}>
            <Plus className="h-5 w-5 mr-2" />
            Create Room
          </Button>
        </div>
        <div className="space-y-8">
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
                {isLoadingProfile ? (
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Your Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingRooms ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              ) : rooms?.length === 0 ? (
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
                    <Card key={room.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <Music className="h-4 w-4 text-primary" />
                              <h4 className="font-medium text-lg">{room.name}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {room.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {room.equipment?.map((item) => (
                              <span
                                key={item}
                                className="inline-block bg-secondary px-2 py-0.5 text-xs rounded"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Your Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              ) : bookings?.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No bookings found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/")}
                  >
                    Browse Rooms
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {bookings?.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h4 className="font-medium text-lg">{booking.rooms.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {booking.rooms.description}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              <span>{format(new Date(booking.start_time), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {format(new Date(booking.start_time), "h:mm a")} - {format(new Date(booking.end_time), "h:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;