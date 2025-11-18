"use client";
import React, { useState, useEffect } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";


export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Clear previous summary data when user lands on upload page
useEffect(() => {
  const clearStorage = () => {
    try {
      localStorage.removeItem('summaryData');
      localStorage.removeItem('uploadedFile');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  };

  clearStorage();
  const timer = setTimeout(clearStorage, 100);
  
  return () => clearTimeout(timer);
}, []);



  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    console.log("Uploaded:", uploadedFiles);
  };


  const handleGenerateSummary = async () => {
    if (files.length === 0) {
      alert("Please upload a PDF file first!");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('language', 'English');

      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to generate summary');
      }

      if (!data.summary || !data.story) {
        throw new Error('Invalid response format from API');
      }

      localStorage.setItem('summaryData', JSON.stringify(data));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const fileData = {
            name: files[0].name,
            type: files[0].type,
            size: files[0].size,
            data: reader.result
          };
          
          const dataStr = JSON.stringify(fileData);
          if (dataStr.length > 4.5 * 1024 * 1024) {
            console.warn('File too large for localStorage, skipping language regeneration feature');
            localStorage.removeItem('uploadedFile');
          } else {
            localStorage.setItem('uploadedFile', dataStr);
          }
        } catch (e) {
          console.error('Error storing file:', e);
        }
        
        router.push(`/summarized?file=${encodeURIComponent(files[0].name)}`);
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        router.push(`/summarized?file=${encodeURIComponent(files[0].name)}`);
      };
      
      reader.readAsDataURL(files[0]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
      alert(`Error: ${errorMessage}\n\nPlease try again in a few seconds.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black py-20 px-2 md:px-6 flex flex-col items-center">
      <h1 className="text-4xl md:text-6xl font-bold text-center text-black dark:text-white">
        Upload Your PDF
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 text-center mt-2 max-w-xl">
        Drop your PDF here and AI will summarize it into neat content or reel-style format.
      </p>

      <div className="w-full md:max-w-4xl mt-10">
        <div className="min-h-96 border border-dashed bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 rounded-xl p-6 flex items-center justify-center">
          <FileUpload onChange={handleFileUpload} />
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8 bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl w-full max-w-lg">
          <h2 className="font-bold text-black dark:text-white mb-2">Uploaded File:</h2>
          <p className="text-neutral-600 dark:text-neutral-300">{files[0].name}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {(files[0].size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      <div className="mt-10">
        {isLoading ? (
          <button
            disabled
            className="rounded-full px-10 py-3 text-lg font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed flex items-center gap-2"
          >
            <span className="animate-pulse">⏳</span>
            Generating...
          </button>
        ) : (
          <HoverBorderGradient
            containerClassName="rounded-full"
            onClick={handleGenerateSummary}
            as="button"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-10 py-3 text-lg font-semibold"
          >
            <span>Generate Summary ⚡</span>
          </HoverBorderGradient>
        )}
      </div>

      {isLoading && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4 text-center max-w-md">
          Processing your PDF... This may take 10-30 seconds depending on file size.
        </p>
      )}
    </div>
  );
}
