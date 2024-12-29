import { RoomCard } from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
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

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container px-4">
        <div className="flex justify-end mb-8">
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>

        <div className="mb-12 text-center">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/aac7c64e-04f1-43ba-9fc5-a6f47582a661.png" 
              alt="Geometric illustration with figures" 
              className="w-32 h-32 mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Drum Room</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Reserve your perfect practice space. Choose from our selection of
            well-equipped rooms for individual or group practice.
            {!isAuthenticated && (
              <span className="block mt-2 text-sm text-primary">
                Login to book a room
              </span>
            )}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRACTICE_ROOMS.map((room) => (
            <RoomCard 
              key={room.name} 
              {...room} 
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;