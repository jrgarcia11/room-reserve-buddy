import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { setHours, setMinutes, addHours } from "date-fns";
import { Music, CalendarDays, Clock, ArrowLeft } from "lucide-react";
import { ImageCarousel } from "@/components/ImageCarousel";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";

async function fetchRoom(roomId: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();
  
  if (error) throw error;
  return data;
}

async function fetchBookings(roomId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('room_id', roomId);
  
  if (error) throw error;
  return data;
}

async function createBooking({ roomId, startTime, endTime }: { roomId: string, startTime: Date, endTime: Date }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        room_id: roomId,
        user_id: user.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export default function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: room, isLoading: roomLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => fetchRoom(roomId!),
    enabled: !!roomId,
  });

  const { data: existingBookings } = useQuery({
    queryKey: ['bookings', roomId, selectedDate],
    queryFn: () => fetchBookings(roomId!),
    enabled: !!roomId,
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast({
        title: "Booking confirmed!",
        description: "Your room has been successfully booked.",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !roomId) return;

    const [hours] = selectedTime.split(':').map(Number);
    const startTime = setHours(setMinutes(selectedDate, 0), hours);
    const endTime = addHours(startTime, 1);

    bookingMutation.mutate({
      roomId,
      startTime,
      endTime,
    });
  };

  if (roomLoading) {
    return <div className="container py-12">Loading...</div>;
  }

  if (!room) {
    return <div className="container py-12">Room not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Card className="bg-gradient-to-r from-[#F2FCE2] to-[#F1F0FB]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              {room.name}
            </CardTitle>
            <CardDescription>{room.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Select Date
                </h3>
                <BookingCalendar
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>
              <div className="h-[400px]">
                <ImageCarousel 
                  className="h-full rounded-lg overflow-hidden" 
                  images={room.images}
                  fullSize
                />
              </div>
            </div>

            {selectedDate && (
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Select Time
                </h3>
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  existingBookings={existingBookings || []}
                  onTimeSelect={setSelectedTime}
                />
              </div>
            )}

            <Button
              className="w-full"
              disabled={!selectedDate || !selectedTime || bookingMutation.isPending}
              onClick={handleBooking}
            >
              {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}