import React, { useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 900);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-geometric-grid flex flex-col items-center justify-center p-6 select-none">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-24 h-24 rounded-full border-4 border-sky-200 animate-ping absolute opacity-75"></div>

        {/* Spinning gradient ring */}
        <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-sky-500 border-r-orange-500 animate-spin"></div>

        {/* Inner solid orb */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-orange-500 absolute shadow-lg shadow-sky-500/50 animate-pulse"></div>
      </div>
    </div>
  );
};
