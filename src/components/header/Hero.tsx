interface HeroProps {
  isAuthenticated: boolean;
}

export const Hero = ({ isAuthenticated }: HeroProps) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center gap-6 mb-4 bg-gradient-to-r from-[#e6e9f0] to-[#eef1f5] p-6 rounded-lg">
        <img
          src="/lovable-uploads/aac7c64e-04f1-43ba-9fc5-a6f47582a661.png"
          alt="Geometric illustration with figures"
          className="w-32 h-32"
        />
        <h1 className="text-4xl font-bold text-primary">Drum Room</h1>
      </div>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-center">
        Reserve your perfect practice space. Choose from our selection of
        well-equipped rooms for individual or group practice.
        {!isAuthenticated && (
          <span className="block mt-2 text-sm text-primary">
            Login to book a room
          </span>
        )}
      </p>
    </div>
  );
};