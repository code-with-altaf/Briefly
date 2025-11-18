"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const demoStories: string[] = [
  "Executive Summary: The uploaded PDF highlights the rapid adoption of AI across global industries. It explains how automation, data analysis, and intelligent decision-making are reshaping traditional business workflows.",
  
  "Market Insight: The report outlines a surge in enterprise AI investments during the last three years. Companies are shifting from experimental use cases to full-scale deployment, focusing on efficiency and operational accuracy.",
  
  "Technical Breakdown: The document provides an in-depth explanation of machine learning pipelines, data preprocessing requirements, model evaluation metrics, and integration challenges faced by mid-sized organizations.",
  
  "Final Assessment: The PDF concludes by emphasizing that AI is no longer optional. Businesses that adopt structured automation and analytics early gain measurable advantages in productivity, cost reduction, and strategic forecasting."
];

const DummyStoryCard: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [index]);

  const next = () => {
    if (index < demoStories.length - 1) {
      setLoading(true);
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setLoading(true);
      setIndex(index - 1);
    }
  };

  return (
    <Card className="w-[380px] h-[600px] bg-black text-white rounded-3xl overflow-hidden shadow-2xl relative border border-white/20">

      <div onClick={prev} className="absolute left-0 top-0 h-full w-1/2 z-30 cursor-pointer" />
      <div onClick={next} className="absolute right-0 top-0 h-full w-1/2 z-30 cursor-pointer" />

      <CardContent className="p-6 flex items-center justify-center h-full">
        {loading ? (
          <div className="w-full flex flex-col gap-4">
            <Skeleton className="h-6 w-3/4 bg-gray-700" />
            <Skeleton className="h-6 w-4/5 bg-gray-700" />
            <Skeleton className="h-6 w-2/3 bg-gray-700" />
            <Skeleton className="h-6 w-1/2 bg-gray-700" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="text-lg leading-relaxed z-10"
            >
              {demoStories[index]}
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>

      <div className="absolute top-4 left-3 right-3 flex gap-2">
        {demoStories.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 rounded-full transition-all",
              i <= index ? "bg-white w-full" : "bg-gray-600 w-full opacity-40"
            )}
          />
        ))}
      </div>
    </Card>
  );
};

export default DummyStoryCard;
