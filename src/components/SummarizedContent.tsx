"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import StoryCard from "@/components/StoryCard";
import LanguageSelector from "@/components/LanguageSelector";
import CopyButton from "@/components/CopyButton";
import DownloadDropdown from "@/components/DownloadDropdown";
import {
  IconLayoutGrid,
  IconDeviceMobile,
  IconRefresh,
} from "@tabler/icons-react";
import { useSummary } from "@/context/SummaryContext";
import { SummaryData } from "@/types/summary";
import { renderTextWithBold } from "@/lib/summaryUtils";

// ✅ PERFECT TYPES from your API response
interface ApiSummaryResponse {
  success: boolean;
  fileName: string;
  summary: SummaryData;
  story: string[];
  language: string;
}

const SummarizedContent: React.FC = () => {
  const searchParams = useSearchParams();
  const fileName = searchParams.get("file");

  const {
    summaryData,
    currentLanguage,
    isRegenerating,
    updateSummaryData,
    setIsRegenerating,
  } = useSummary() as {
    summaryData: SummaryData | null;
    currentLanguage: string;
    isRegenerating: boolean;
    updateSummaryData: (data: ApiSummaryResponse) => void;
    setIsRegenerating: (value: boolean) => void;
  };

  const [viewMode, setViewMode] = useState<"summary" | "story">("summary");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [hasFileInStorage, setHasFileInStorage] = useState(false);

  useEffect(() => {
    const loadFile = async () => {
      const storedFile = localStorage.getItem("uploadedFile");

      if (storedFile) {
        try {
          const fileData = JSON.parse(storedFile);
          const byteString = atob(fileData.data.split(",")[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: fileData.type });
          const file = new File([blob], fileData.name, { type: fileData.type });
          setOriginalFile(file);
          setHasFileInStorage(true);
        } catch (error) {
          console.error("Error loading file:", error);
          setHasFileInStorage(false);
        }
      }
    };

    loadFile();
  }, []);

  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage === currentLanguage) {
      return;
    }

    if (!originalFile) {
      alert(
        "Original file not available. Please upload the PDF again to regenerate in different languages."
      );
      return;
    }

    setIsRegenerating(true);

    try {
      const formData = new FormData();
      formData.append("file", originalFile);
      formData.append("language", newLanguage);

      const response = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });

      const data: ApiSummaryResponse = await response.json();

      if (!response.ok) {
        // ✅ 100% type-safe - matches your API error response
        const errorData = data as { error?: string; details?: string };
        throw new Error(
          errorData.error || errorData.details || "Failed to regenerate summary"
        );
      }

      if (!data.summary || !data.story) {
        throw new Error("Invalid response format from API");
      }

      localStorage.setItem("summaryData", JSON.stringify(data));
      updateSummaryData(data);
    } catch (error) {
      console.error("Error regenerating summary:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to regenerate summary";
      alert(`Error: ${errorMessage}\n\nPlease try again.`);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!summaryData) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-black dark:text-white">Loading summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black py-10 px-2 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl hidden lg:block mb-6 font-bold text-center text-black dark:text-white">
          Your Summary is Ready! ⚡
        </h1>
        {fileName && (
          <p className="text-neutral-600 dark:text-neutral-400 text-center mt-2">
            File: {fileName}
          </p>
        )}
        {!hasFileInStorage && (
          <p className="text-yellow-600 dark:text-yellow-400 text-center mt-1 text-sm">
            ⚠️ Language regeneration unavailable (file too large for browser
            storage)
          </p>
        )}

        <div className="flex justify-center items-center gap-3 mt-6 lg:hidden">
          <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-700 p-1 bg-neutral-100 dark:bg-neutral-900">
            <button
              onClick={() => setViewMode("summary")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
                viewMode === "summary"
                  ? "bg-white dark:bg-black text-black dark:text-white shadow-md"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <IconLayoutGrid size={18} />
              Summary
            </button>
            <button
              onClick={() => setViewMode("story")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
                viewMode === "story"
                  ? "bg-white dark:bg-black text-black dark:text-white shadow-md"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <IconDeviceMobile size={18} />
              Story Mode
            </button>
          </div>

          {hasFileInStorage && (
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              isRegenerating={isRegenerating}
            />
          )}
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mt-10 px-6">
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Summary View
            </h2>

            <div className="flex items-center gap-2">
              {hasFileInStorage && (
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                  isRegenerating={isRegenerating}
                />
              )}
              <CopyButton summaryData={summaryData} />
              <DownloadDropdown summaryData={summaryData} />
            </div>
          </div>

          {isRegenerating ? (
            <div className="flex flex-col items-center justify-center py-20">
              <IconRefresh
                size={40}
                className="animate-spin text-neutral-400 mb-4"
              />
              <p className="text-neutral-600 dark:text-neutral-400 text-center">
                Regenerating summary in {currentLanguage}...
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                This may take 10-30 seconds
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {summaryData.sections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    {renderTextWithBold(section.heading)}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {renderTextWithBold(section.content)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="sticky top-6 flex flex-col gap-4">
            <StoryCard />
          </div>
        </div>
      </div>

      <div className="lg:hidden max-w-lg mx-auto mt-10">
        {viewMode === "summary" ? (
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black dark:text-white">
                Summary
              </h2>
              <div className="flex items-center gap-2">
                <CopyButton summaryData={summaryData} />
                <DownloadDropdown summaryData={summaryData} />
              </div>
            </div>

            {isRegenerating ? (
              <div className="flex flex-col items-center justify-center py-10">
                <IconRefresh
                  size={32}
                  className="animate-spin text-neutral-400 mb-3"
                />
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                  Regenerating summary in selected language...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {summaryData.sections.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-base font-semibold text-black dark:text-white mb-1">
                      {renderTextWithBold(section.heading)}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {renderTextWithBold(section.content)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <StoryCard />
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarizedContent;
