import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowLeft } from "lucide-react";
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

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container px-4 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
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
              <CardTitle>Your Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : bookings?.length === 0 ? (
                <p className="text-muted-foreground">No bookings found</p>
              ) : (
                <div className="space-y-4">
                  {bookings?.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{booking.rooms.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <CalendarDays className="h-4 w-4" />
                              <span>
                                {format(
                                  new Date(booking.start_time),
                                  "MMM d, yyyy h:mm a"
                                )}
                                {" - "}
                                {format(
                                  new Date(booking.end_time),
                                  "h:mm a"
                                )}
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