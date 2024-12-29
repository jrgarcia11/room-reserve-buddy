import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";

const CreateRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("edit");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);

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
          setName(data.name);
          setDescription(data.description || "");
          setCapacity(data.capacity.toString());
          setEquipment(data.equipment || []);
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

  const handleAddEquipment = () => {
    if (!newEquipment.trim()) return;
    setEquipment([...equipment, newEquipment.trim()]);
    setNewEquipment("");
  };

  const handleRemoveEquipment = (index: number) => {
    setEquipment(equipment.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a room");
        navigate("/login");
        return;
      }

      const roomData = {
        name,
        description,
        capacity: parseInt(capacity),
        equipment,
        user_id: user.id
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Equipment</Label>
                <div className="flex gap-2">
                  <Input
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Add equipment..."
                  />
                  <Button 
                    type="button"
                    onClick={handleAddEquipment}
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {equipment.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                    >
                      <span className="text-sm">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveEquipment(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (editId ? "Updating..." : "Creating...") : (editId ? "Update Room" : "Create Room")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRoom;