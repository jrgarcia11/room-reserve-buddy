import { SlotMachineText } from "./SlotMachineText";

interface HeroProps {
  isAuthenticated: boolean;
}

export const Hero = ({ isAuthenticated }: HeroProps) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center gap-6 mb-4 bg-gradient-to-r from-[#F2FCE2] to-[#F1F0FB] p-1 rounded-lg">
        <div className="flex-shrink-0">
          <img
            src="/lovable-uploads/aac7c64e-04f1-43ba-9fc5-a6f47582a661.png"
            alt="Geometric illustration with figures"
            className="w-32 h-32"
          />
        </div>
        <div className="text-center flex-grow">
          <p className="text-xl text-muted-foreground mb-2">
            Reserve your perfect
          </p>
          <h1 className="text-6xl font-bold text-primary font-bebas tracking-wider text-center">
            <SlotMachineText />
          </h1>
        </div>
      </div>
      
      <p className="mx-auto max-w-2xl text-xl text-muted-foreground text-center">
        {!isAuthenticated && (
          <span className="block mt-2 text-base text-primary">
            Login to book a room
          </span>
        )}
      </p>
    </div>
  );
};