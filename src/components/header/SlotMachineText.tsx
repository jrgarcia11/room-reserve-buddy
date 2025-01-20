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
    }, 4000); // Increased from 2000ms to 4000ms (4 seconds)

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block min-w-[140px] transition-all duration-1000">
      {spaces[currentIndex]}
    </span>
  );
};