import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ImageCarousel } from "./ImageCarousel";

interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  capacity: number;
  equipment: string[];
  images?: string[];
  isAuthenticated: boolean;
}

export function RoomCard({ 
  id, 
  name, 
  description, 
  capacity, 
  equipment, 
  images,
  isAuthenticated 
}: RoomCardProps) {
  const navigate = useNavigate();

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/booking/${id}`);
  };

  return (
    <Card className="w-full transition-all">
      <ImageCarousel images={images} />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          {name}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">Capacity: {capacity} people</p>
          <div className="mt-2">
            {equipment.map((item) => (
              <span
                key={item}
                className="mr-2 inline-block bg-secondary px-2 py-0.5 text-xs"
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