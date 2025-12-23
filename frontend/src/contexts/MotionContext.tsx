import React, { createContext, useContext, useEffect, useState } from "react";

interface MotionContextType {
  prefersReducedMotion: boolean;
  isMotionEnabled: boolean;
}

const MotionContext = createContext<MotionContextType>({
  prefersReducedMotion: false,
  isMotionEnabled: true,
});

export const useMotion = () => {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used within a MotionProvider");
  }
  return context;
};

interface MotionProviderProps {
  children: React.ReactNode;
}

export const MotionProvider: React.FC<MotionProviderProps> = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMotionEnabled, setIsMotionEnabled] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      setIsMotionEnabled(!e.matches);
    };

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);
    setIsMotionEnabled(!mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const value = {
    prefersReducedMotion,
    isMotionEnabled,
  };

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
};

export default MotionProvider;
