import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { RoomImageUpload } from "./RoomImageUpload";

interface RoomFormProps {
  initialData?: {
    name: string;
    description: string;
    capacity: string;
    equipment: string[];
    images: string[];
  };
  onSubmit: (data: {
    name: string;
    description: string;
    capacity: number;
    equipment: string[];
    images: string[];
  }) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function RoomForm({ initialData, onSubmit, isSubmitting, submitLabel }: RoomFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [capacity, setCapacity] = useState(initialData?.capacity || "");
  const [equipment, setEquipment] = useState<string[]>(initialData?.equipment || []);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [newEquipment, setNewEquipment] = useState("");

  const handleAddEquipment = () => {
    if (!newEquipment.trim()) return;
    setEquipment([...equipment, newEquipment.trim()]);
    setNewEquipment("");
  };

  const handleRemoveEquipment = (index: number) => {
    setEquipment(equipment.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      capacity: parseInt(capacity),
      equipment,
      images,
    });
  };

  return (
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
      <div className="space-y-2">
        <Label>Room Images</Label>
        <RoomImageUpload images={images} onImagesChange={setImages} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}