import { Calendar } from "@/components/ui/calendar";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export function BookingCalendar({ selectedDate, setSelectedDate }: BookingCalendarProps) {
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      disabled={(date) => date < new Date()}
      className="rounded-md border"
    />
  );
}