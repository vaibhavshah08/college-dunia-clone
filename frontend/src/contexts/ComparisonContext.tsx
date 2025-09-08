import React, { createContext, useContext, useState, useCallback } from "react";
import { College } from "../types/api";

interface ComparisonContextType {
  selectedColleges: College[];
  addToComparison: (college: College) => void;
  removeFromComparison: (collegeId: string) => void;
  clearComparison: () => void;
  isInComparison: (collegeId: string) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined
);

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
};

interface ComparisonProviderProps {
  children: React.ReactNode;
  maxColleges?: number;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({
  children,
  maxColleges = 4,
}) => {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);

  const addToComparison = useCallback(
    (college: College) => {
      setSelectedColleges((prev) => {
        // Check if college is already in comparison
        if (prev.some((c) => c.college_id === college.college_id)) {
          return prev;
        }

        // Check if we can add more colleges
        if (prev.length >= maxColleges) {
          return prev;
        }

        return [...prev, college];
      });
    },
    [maxColleges]
  );

  const removeFromComparison = useCallback((collegeId: string) => {
    setSelectedColleges((prev) =>
      prev.filter((c) => c.college_id !== collegeId)
    );
  }, []);

  const clearComparison = useCallback(() => {
    setSelectedColleges([]);
  }, []);

  const isInComparison = useCallback(
    (collegeId: string) => {
      return selectedColleges.some((c) => c.college_id === collegeId);
    },
    [selectedColleges]
  );

  const canAddMore = selectedColleges.length < maxColleges;

  const value: ComparisonContextType = {
    selectedColleges,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};
