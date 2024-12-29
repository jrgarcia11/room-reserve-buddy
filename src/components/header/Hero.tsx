interface HeroProps {
  isAuthenticated: boolean;
}

export const Hero = ({ isAuthenticated }: HeroProps) => {
  return (
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
  );
};