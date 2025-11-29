import React from 'react';

// Process raw story data into clean text array - handles various API response shapes
export const processStoryData = (story: unknown[]): string[] => {
  return story.map((item) => {
    if (typeof item === 'string') return item;
    
    if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>;
      
      // Common pattern: title + content objects
      if (obj.title && obj.content) {
        return `${obj.title}\n\n${obj.content}`;
      }
      
      // Fallback to any text field or stringify
      return (
        (obj.content as string) ||
        (obj.text as string) ||
        (obj.title as string) ||
        JSON.stringify(obj)
      );
    }
    
    return String(item);
  });
};

// Render markdown text with **bold** support - splits and converts inline
export const renderTextWithBold = (text: string): React.ReactNode => {
  if (!text) return null;
  
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    
    // Strip any leftover * or **
    const clean = part.replace(/\*\*/g, '').replace(/\*/g, '');
    return <React.Fragment key={index}>{clean}</React.Fragment>;
  });
};
