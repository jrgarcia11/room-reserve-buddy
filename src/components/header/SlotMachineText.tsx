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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % spaces.length);
        setIsAnimating(false);
      }, 500);
    }, 4000); // Increased from 2000ms to 4000ms (4 seconds)

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`
        inline-block min-w-[140px] 
        ${isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
        transition-all duration-500 ease-in-out
      `}
    >
      {spaces[currentIndex]}
    </span>
  );
};