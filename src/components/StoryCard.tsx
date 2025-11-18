"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StoryCard: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [storyData, setStoryData] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = localStorage.getItem("summaryData");

        if (!storedData) {
          setError(true);
          setLoading(false);
          return;
        }

        const data = JSON.parse(storedData);

        if (!data.story || data.story.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }

        const processedStory = data.story.map((item: unknown) => {
          if (typeof item === "string") return item;

          if (item && typeof item === "object") {
            const obj = item as Record<string, unknown>;
            return (
              obj["content"] ||
              obj["text"] ||
              obj["title"] ||
              JSON.stringify(obj)
            );
          }

          return String(item);
        });

        setStoryData(processedStory);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load story data:", err);
        setError(true);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🔥 FIXED ANIMATION VARIANTS
  const variants = {
    enter: (dir: number) => ({
      x: dir === 1 ? 300 : -300, // ✅ Right (1) enters from +300, Left (-1) enters from -300
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir === 1 ? -300 : 300, // ✅ Right (1) exits to -300, Left (-1) exits to +300
      opacity: 0,
    }),
  };

  const next = () => {
    if (index < storyData.length - 1) {
      setDirection(1); // 👉 NEXT = slide from right
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setDirection(-1); // 👈 PREVIOUS = slide from left
      setIndex(index - 1);
    }
  };

  if (error) {
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

  if (loading) {
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
      {/* LEFT CLICK */}
      <div
        onClick={prev}
        className="absolute left-0 top-0 h-full w-1/2 z-30 cursor-pointer"
      />

      {/* RIGHT CLICK */}
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
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="text-lg leading-relaxed z-10"
          >
            {storyData[index]}
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
