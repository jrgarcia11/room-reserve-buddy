import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthButtons } from "@/components/header/AuthButtons";
import { Hero } from "@/components/header/Hero";
import { RoomsList } from "@/components/rooms/RoomsList";

async function fetchRooms() {
  const { data, error } = await supabase.from("rooms").select("*");
  if (error) throw error;
  return data;
}

const Index = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
  });

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

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
        <div className="flex justify-end mb-8 gap-2">
          <AuthButtons isAuthenticated={isAuthenticated} />
        </div>

        <Hero isAuthenticated={isAuthenticated} />
        
        <RoomsList
          rooms={rooms}
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
};

export default Index;