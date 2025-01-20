import { useEffect, useState } from "react";

const spaces = [
  "rehearsal space",
  "recording studio",
  "practice room",
  "jam space",
  "performance venue",
  "drum room",
  "band room"
];

export const SlotMachineText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spaces.length);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block min-w-[140px] transition-all duration-500 animate-fade-in">
      {spaces[currentIndex]}
    </span>
  );
};