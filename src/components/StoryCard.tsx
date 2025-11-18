"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { renderTextWithBold, useSummary } from "@/context/SummaryContext";

const StoryCard: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { storyData, isRegenerating } = useSummary();

  const variants = {
    enter: (dir: number) => ({
      x: dir === 1 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir === 1 ? -200 : 200,
      opacity: 0,
    }),
  };

  const next = () => {
    if (index < storyData.length - 1) {
      setDirection(1);
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex(index - 1);
    }
  };

  // Reset index when story data changes
  React.useEffect(() => {
    setIndex(0);
  }, [storyData]);

  if (!storyData || storyData.length === 0) {
    return (
      <Card className="w-[380px] h-[600px] bg-black text-white rounded-3xl overflow-hidden shadow-2xl relative border border-red-500/50">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full gap-4">
          <div className="text-6xl">❌</div>
          <p className="text-xl font-bold text-center">Failed to Load Story</p>
          <p className="text-sm text-gray-400 text-center">
            No story data found. Please upload a PDF first.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isRegenerating) {
    return (
      <Card className="w-[380px] h-[600px] bg-black text-white rounded-3xl overflow-hidden shadow-2xl relative border border-white/20">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <div className="w-full flex flex-col gap-4">
            <Skeleton className="h-6 w-3/4 bg-gray-700" />
            <Skeleton className="h-6 w-4/5 bg-gray-700" />
            <Skeleton className="h-6 w-2/3 bg-gray-700" />
            <Skeleton className="h-6 w-1/2 bg-gray-700" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[380px] h-[600px] bg-black text-white rounded-3xl overflow-hidden shadow-2xl relative border border-white/20">
      <div
        onClick={prev}
        className="absolute left-0 top-0 h-full w-1/2 z-30 cursor-pointer"
      />

      <div
        onClick={next}
        className="absolute right-0 top-0 h-full w-1/2 z-30 cursor-pointer"
      />

      <CardContent className="p-6 flex items-center justify-center h-full">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="text-lg leading-relaxed z-10"
          >
            {renderTextWithBold(storyData[index])}
          </motion.div>
        </AnimatePresence>
      </CardContent>

      <div className="absolute top-4 left-3 right-3 flex gap-2">
        {storyData.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 rounded-full transition-all",
              i <= index ? "bg-white w-full" : "bg-gray-600 w-full opacity-40"
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
        {index + 1} / {storyData.length}
      </div>
    </Card>
  );
};

export default StoryCard;
