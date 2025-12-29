import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AuthButtons } from "@/components/header/AuthButtons";
import { Hero } from "@/components/header/Hero";
import { RoomsList } from "@/components/rooms/RoomsList";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";
import { fetchRooms } from "@/services/rooms";

const Index = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading rooms",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <PageLayout>
      <div className="flex justify-end mb-8 gap-2">
        <AuthButtons isAuthenticated={isAuthenticated} />
      </div>

      <Hero isAuthenticated={isAuthenticated} />
      
      <RoomsList
        rooms={rooms}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
      />
    </PageLayout>
  );
};

export default Index;