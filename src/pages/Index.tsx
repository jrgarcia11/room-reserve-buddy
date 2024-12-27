import { RoomCard } from "@/components/RoomCard";

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
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary">
            Practice Room Booking
          </h1>
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