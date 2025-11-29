"use client";

import React, { Suspense } from "react";
import SummarizedContent from "@/components/SummarizedContent";

export default function SummarizedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-white dark:bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
            <p className="text-black dark:text-white">Loading...</p>
          </div>
        </div>
      }
    >
      <SummarizedContent />
    </Suspense>
  );
}
