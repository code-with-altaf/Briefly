"use client";

import { processStoryData } from '@/lib/summaryUtils';
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
  // Initialize state directly from localStorage (lazy initialization)
  const [summaryData, setSummaryData] = useState<SummaryData | null>(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      const storedData = localStorage.getItem('summaryData');
      if (storedData) {
        const data = JSON.parse(storedData) as ApiResponse;
        return data.summary || null;
      }
    } catch (error) {
      console.error('Error loading initial summary data:', error);
      localStorage.removeItem('summaryData');
    }
    return null;
  });

  const [storyData, setStoryData] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const storedData = localStorage.getItem('summaryData');
      if (storedData) {
        const data = JSON.parse(storedData) as ApiResponse;
        if (data.story && data.story.length > 0) {
          return processStoryData(data.story);
        }
      }
    } catch (error) {
      console.error('Error loading initial story data:', error);
    }
    return [];
  });

  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    if (typeof window === 'undefined') return 'English';
    
    try {
      const storedData = localStorage.getItem('summaryData');
      if (storedData) {
        const data = JSON.parse(storedData) as ApiResponse;
        return data.language || 'English';
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
    return 'English';
  });

  const [isRegenerating, setIsRegenerating] = useState(false);

  // Fallback useEffect to retry if initial load fails
  useEffect(() => {
    if (!summaryData && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          const storedData = localStorage.getItem('summaryData');
          if (storedData) {
            console.log('Fallback loading data from localStorage');
            const data = JSON.parse(storedData) as ApiResponse;
            if (data.summary) {
              setSummaryData(data.summary);
              setCurrentLanguage(data.language || 'English');
              if (data.story && data.story.length > 0) {
                setStoryData(processStoryData(data.story));
              }
            }
          }
        } catch (error) {
          console.error('Fallback load failed:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [summaryData]);

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
