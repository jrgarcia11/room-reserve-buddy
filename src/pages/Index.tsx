import { RoomCard } from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const PRACTICE_ROOMS = [
  {
    name: "Piano Studio A",
    description: "Professional acoustic piano room with sound treatment",
    capacity: 3,
    equipment: ["Grand Piano", "Music Stand", "Recording Equipment"],
  },
  {
    name: "Ensemble Room B",
    description: "Large space perfect for group practice",
    capacity: 8,
    equipment: ["Upright Piano", "Chairs", "Music Stands"],
  },
  {
    name: "Practice Room C",
    description: "Cozy space for individual practice",
    capacity: 2,
    equipment: ["Digital Piano", "Music Stand"],
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Practice Room Booking
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <div className="mb-12 text-center">
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Reserve your perfect practice space. Choose from our selection of
            well-equipped rooms for individual or group practice.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRACTICE_ROOMS.map((room) => (
            <RoomCard key={room.name} {...room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;