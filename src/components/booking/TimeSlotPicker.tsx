import { Button } from "@/components/ui/button";
import { format, addHours, setHours, setMinutes } from "date-fns";

interface TimeSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  existingBookings: any[];
  onTimeSelect: (time: string) => void;
}

export function TimeSlotPicker({ selectedDate, selectedTime, existingBookings, onTimeSelect }: TimeSlotPickerProps) {
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9; // Start from 9 AM
    return `${hour}:00`;
  });

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

  return (
    <div className="grid grid-cols-3 gap-2">
      {timeSlots.map((time) => {
        const isBooked = isTimeSlotBooked(time);
        return (
          <Button
            key={time}
            variant={selectedTime === time ? "default" : "outline"}
            className={isBooked ? "opacity-50 cursor-not-allowed" : ""}
            onClick={() => !isBooked && onTimeSelect(time)}
            disabled={isBooked}
          >
            {time}
          </Button>
        );
      })}
    </div>
  );
}