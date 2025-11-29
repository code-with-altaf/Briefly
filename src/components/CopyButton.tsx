"use client";

import React, { useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { SummaryData } from "@/types/summary";

const copySummaryToClipboard = async (
  summaryData: SummaryData
): Promise<boolean> => {
  try {
    const content =
      `${summaryData.title}\n${"=".repeat(summaryData.title.length)}\n\n` +
      summaryData.sections
        .map(
          (section) =>
            `${section.heading}\n${"-".repeat(section.heading.length)}\n${
              section.content
            }\n\n`
        )
        .join("");

    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(content);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = content;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error("Copy error:", error);
    return false;
  }
};

interface CopyButtonProps {
  summaryData: SummaryData;
}

const CopyButton: React.FC<CopyButtonProps> = ({ summaryData }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copySummaryToClipboard(summaryData);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      alert("Failed to copy to clipboard. Please try again.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
      title={isCopied ? "Copied!" : "Copy to clipboard"}
    >
      {isCopied ? (
        <IconCheck size={20} className="text-green-600 dark:text-green-400" />
      ) : (
        <IconCopy size={20} className="text-black dark:text-white" />
      )}
    </button>
  );
};

export default CopyButton;
