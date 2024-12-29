import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  name: string;
  description: string;
  capacity: number;
  equipment: string[];
  isAuthenticated: boolean;
}

export function RoomCard({ name, description, capacity, equipment, isAuthenticated }: RoomCardProps) {
  const navigate = useNavigate();

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    // Booking logic will be implemented later
  };

  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          {name}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Capacity: {capacity} people</p>
          <div className="mt-2">
            {equipment.map((item) => (
              <span
                key={item}
                className="mr-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <Button 
          className="w-full gap-2" 
          onClick={handleBooking}
        >
          <CalendarDays className="h-4 w-4" />
          {isAuthenticated ? "Book Now" : "Login to Book"}
        </Button>
      </CardContent>
    </Card>
  );
}