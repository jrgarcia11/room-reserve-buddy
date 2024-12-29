import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, addHours, setHours, setMinutes } from "date-fns";
import { Music, CalendarDays, Clock } from "lucide-react";

// Fetch room details
async function fetchRoom(roomId: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();
  
  if (error) throw error;
  return data;
}

// Fetch existing bookings for the room
async function fetchBookings(roomId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('room_id', roomId);
  
  if (error) throw error;
  return data;
}

// Create a new booking
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

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 9; // Start from 9 AM
  return `${hour}:00`;
});

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

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

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

  const isTimeSlotBooked = (time: string) => {
    if (!selectedDate || !existingBookings) return false;

    const [hours] = time.split(':').map(Number);
    const slotStart = setHours(setMinutes(selectedDate, 0), hours);
    const slotEnd = addHours(slotStart, 1);

    return existingBookings.some(booking => {
      const bookingStart = new Date(booking.start_time);
      const bookingEnd = new Date(booking.end_time);
      return (
        (slotStart >= bookingStart && slotStart < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd)
      );
    });
  };

  if (roomLoading) {
    return <div className="container py-12">Loading...</div>;
  }

  if (!room) {
    return <div className="container py-12">Room not found</div>;
  }

  return (
    <div className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            {room.name}
          </CardTitle>
          <CardDescription>{room.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Select Date
            </h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Select Time
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => {
                  const isBooked = isTimeSlotBooked(time);
                  return (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={isBooked ? "opacity-50 cursor-not-allowed" : ""}
                      onClick={() => !isBooked && handleTimeSelect(time)}
                      disabled={isBooked}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
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
  );
}