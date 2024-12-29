import { RoomCard } from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*');
  
  if (error) throw error;
  return data;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  });

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

  if (error) {
    toast({
      title: "Error loading rooms",
      description: "Please try again later",
      variant: "destructive",
    });
  }

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
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4 p-6 border rounded-lg">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))
          ) : rooms?.map((room) => (
            <RoomCard 
              key={room.id}
              id={room.id}
              name={room.name}
              description={room.description || ''}
              capacity={room.capacity}
              equipment={room.equipment || []}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;