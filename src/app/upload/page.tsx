"use client";
import React, { useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // ✅ FIX: Only redirect if successful
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to generate summary');
      }

      // ✅ Verify data structure before saving
      if (!data.summary || !data.story) {
        throw new Error('Invalid response format from API');
      }

      localStorage.setItem('summaryData', JSON.stringify(data));
      
      // ✅ Only redirect after successful save
      router.push(`/summarized?file=${encodeURIComponent(files[0].name)}`);

    } catch (error) {
      console.error('Error:', error);
      
      // ✅ Show detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
      alert(`Error: ${errorMessage}\n\nPlease try again in a few seconds.`);
      
      // ✅ Don't redirect on error
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
        </div>
      )}

      <div className="mt-10">
        <HoverBorderGradient
          containerClassName="rounded-full"
          onClick={handleGenerateSummary}
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-10 py-3 text-lg font-semibold"
        >
          <span>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">⏳</span>
                Generating...
              </span>
            ) : (
              "Generate Summary ⚡"
            )}
          </span>
        </HoverBorderGradient>
      </div>

      {isLoading && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4 text-center">
          Processing your PDF... This may take 10-20 seconds
        </p>
      )}
    </div>
  );
}
