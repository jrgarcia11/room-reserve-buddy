import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RoomForm } from "@/components/rooms/RoomForm";
import { BackButton } from "@/components/layout/BackButton";
import { PageLayout } from "@/components/layout/PageLayout";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { fetchRoom, createRoom, updateRoom } from "@/services/rooms";

const CreateRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("edit");
  const { userId, isLoading: authLoading } = useRequireAuth();

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
    const loadRoom = async () => {
      if (!editId) return;

      try {
        const data = await fetchRoom(editId);
        setInitialData({
          name: data.name,
          description: data.description || "",
          capacity: data.capacity.toString(),
          equipment: data.equipment || [],
          images: data.images || [],
        });
      } catch (error) {
        console.error("Error fetching room:", error);
        toast.error("Failed to fetch room details");
        navigate("/profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoom();
  }, [editId, navigate]);

  const handleSubmit = async (formData: {
    name: string;
    description: string;
    capacity: number;
    equipment: string[];
    images: string[];
  }) => {
    if (!userId) {
      toast.error("You must be logged in to create a room");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const roomData = {
        ...formData,
        user_id: userId,
      };

      if (editId) {
        await updateRoom(editId, roomData);
      } else {
        await createRoom(roomData);
      }

      toast.success(editId ? "Room updated successfully" : "Room created successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Error saving room:", error);
      toast.error("Failed to save room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <PageLayout className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              Loading...
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="max-w-2xl mx-auto">
      <BackButton to="/profile" />
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
    </PageLayout>
  );
};

export default CreateRoom;