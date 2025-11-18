"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DummyStoryCardProps {
  stories: string[];
}

const DummyStoryCard: React.FC<DummyStoryCardProps> = ({ stories }) => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [index]);

  const next = () => {
    if (index < stories.length - 1) {
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
              {stories[index]}
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>

      <div className="absolute top-4 left-3 right-3 flex gap-2">
        {stories.map((_, i) => (
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
