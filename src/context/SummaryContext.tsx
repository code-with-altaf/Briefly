"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface for a single section in the summary
interface SummarySection {
  heading: string;
  content: string;
}

// Interface for the summary data structure
interface SummaryData {
  title: string;
  sections: SummarySection[];
}

// Interface for the API response from the summarize endpoint
interface ApiResponse {
  success?: boolean;
  fileName?: string;
  summary: SummaryData;
  story: unknown[];
  language?: string;
}

// Interface for the Context type
interface SummaryContextType {
  summaryData: SummaryData | null;
  storyData: string[];
  currentLanguage: string;
  isRegenerating: boolean;
  updateSummaryData: (data: ApiResponse) => void;
  setCurrentLanguage: (lang: string) => void;
  setIsRegenerating: (value: boolean) => void;
}

// Create the context with undefined as initial value
const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

// Provider component
export const SummaryProvider = ({ children }: { children: ReactNode }) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [storyData, setStoryData] = useState<string[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<string>('English');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Helper function to process story data
  const processStoryData = (story: unknown[]): string[] => {
    return story.map((item: unknown) => {
      if (typeof item === "string") return item;
      
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        return (
          (obj["content"] as string) ||
          (obj["text"] as string) ||
          (obj["title"] as string) ||
          JSON.stringify(obj)
        );
      }
      
      return String(item);
    });
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedData = localStorage.getItem('summaryData');
        
        if (storedData) {
          const data = JSON.parse(storedData) as ApiResponse;
          
          // Set summary data
          setSummaryData(data.summary);
          
          // Set language
          setCurrentLanguage(data.language || 'English');
          
          // Process and set story data
          if (data.story && data.story.length > 0) {
            const processedStory = processStoryData(data.story);
            setStoryData(processedStory);
          }
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
  }, []);

  // Function to update summary data (called after language change)
  const updateSummaryData = (data: ApiResponse) => {
    setSummaryData(data.summary);
    setCurrentLanguage(data.language || 'English');
    
    if (data.story && data.story.length > 0) {
      const processedStory = processStoryData(data.story);
      setStoryData(processedStory);
    }
  };

  // Context value object
  const value: SummaryContextType = {
    summaryData,
    storyData,
    currentLanguage,
    isRegenerating,
    updateSummaryData,
    setCurrentLanguage,
    setIsRegenerating,
  };

  return (
    <SummaryContext.Provider value={value}>
      {children}
    </SummaryContext.Provider>
  );
};

// Custom hook to use the Summary context
export const useSummary = () => {
  const context = useContext(SummaryContext);
  
  if (context === undefined) {
    throw new Error('useSummary must be used within a SummaryProvider');
  }
  
  return context;
};
