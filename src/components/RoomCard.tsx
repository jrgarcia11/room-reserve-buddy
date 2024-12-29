import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ImageCarousel } from "./ImageCarousel";

interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  capacity: number;
  equipment: string[];
  isAuthenticated: boolean;
}

export function RoomCard({ id, name, description, capacity, equipment, isAuthenticated }: RoomCardProps) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/booking/${id}`);
  };

  return (
    <Card>
      <CardHeader className="p-0">
        <ImageCarousel className="rounded-t-lg h-48 overflow-hidden" />
      </CardHeader>
      <CardContent>
        <CardTitle>{name}</CardTitle>
        <p>{description}</p>
        <p>Capacity: {capacity}</p>
        <p>Equipment: {equipment.join(", ")}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleBookNow}>Book Now</Button>
      </CardFooter>
    </Card>
  );
}
