import { useEffect, useState } from "react";

const spaces = [
  "Drum Room",
  "Recording Studio",
  "Practice Room",
  "Jam Space",
  "Performance Venue",
  "Band Room",
  "Music Studio"
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
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`
        inline-block min-w-[240px] 
        ${isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
        transition-all duration-500 ease-in-out
      `}
    >
      {spaces[currentIndex]}
    </span>
  );
};