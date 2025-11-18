"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SummarySection {
  heading: string;
  content: string;
}

interface SummaryData {
  title: string;
  sections: SummarySection[];
}

interface ApiResponse {
  success?: boolean;
  fileName?: string;
  summary: SummaryData;
  story: unknown[];
  language?: string;
}

interface SummaryContextType {
  summaryData: SummaryData | null;
  storyData: string[];
  currentLanguage: string;
  isRegenerating: boolean;
  updateSummaryData: (data: ApiResponse) => void;
  setCurrentLanguage: (lang: string) => void;
  setIsRegenerating: (value: boolean) => void;
}

const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

export const SummaryProvider = ({ children }: { children: ReactNode }) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [storyData, setStoryData] = useState<string[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<string>('English');
  const [isRegenerating, setIsRegenerating] = useState(false);

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

  useEffect(() => {
    const loadData = () => {
      try {
        const storedData = localStorage.getItem('summaryData');
        
        if (storedData) {
          const data = JSON.parse(storedData) as ApiResponse;
          setSummaryData(data.summary);
          setCurrentLanguage(data.language || 'English');
          
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

  const updateSummaryData = (data: ApiResponse) => {
    setSummaryData(data.summary);
    setCurrentLanguage(data.language || 'English');
    
    if (data.story && data.story.length > 0) {
      const processedStory = processStoryData(data.story);
      setStoryData(processedStory);
    }
  };

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

export const useSummary = () => {
  const context = useContext(SummaryContext);
  
  if (context === undefined) {
    throw new Error('useSummary must be used within a SummaryProvider');
  }
  
  return context;
};

// Helper function to render text with bold markdown (**text**)
export const renderTextWithBold = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold">{boldText}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};
