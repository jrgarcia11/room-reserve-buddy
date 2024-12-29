import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { RoomForm } from "@/components/rooms/RoomForm";
import { useState } from "react";

const CreateRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("edit");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);
  const [initialData, setInitialData] = useState<{
    name: string;
    description: string;
    capacity: string;
    equipment: string[];
    images: string[];
  } | undefined>();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to create a room");
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!editId) return;

      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", editId)
          .single();

        if (error) throw error;

        if (data) {
          setInitialData({
            name: data.name,
            description: data.description || "",
            capacity: data.capacity.toString(),
            equipment: data.equipment || [],
            images: data.images || [],
          });
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        toast.error("Failed to fetch room details");
        navigate("/profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [editId, navigate]);

  const handleSubmit = async (formData: {
    name: string;
    description: string;
    capacity: number;
    equipment: string[];
    images: string[];
  }) => {
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a room");
        navigate("/login");
        return;
      }

      const roomData = {
        ...formData,
        user_id: user.id,
      };

      let error;

      if (editId) {
        ({ error } = await supabase
          .from("rooms")
          .update(roomData)
          .eq("id", editId));
      } else {
        ({ error } = await supabase
          .from("rooms")
          .insert(roomData));
      }

      if (error) throw error;

      toast.success(editId ? "Room updated successfully" : "Room created successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Error saving room:", error);
      toast.error("Failed to save room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container px-4 max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                Loading...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container px-4 max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{editId ? "Edit Room" : "Create New Room"}</CardTitle>
          </CardHeader>
          <CardContent>
            <RoomForm
              initialData={initialData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitLabel={editId ? "Update Room" : "Create Room"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRoom;