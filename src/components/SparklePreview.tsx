"use client";
import { SparklesCore } from "./ui/sparkles";

export function SparklesPreview() {
  return (
    <div className="md:h-[35rem] h-[40rem] w-full dark:bg-neutral-950/80 flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-9xl text-8xl lg:text-9xl font-bold text-center text-white relative z-20">
        Briefly
      </h1>
      <div className="w-[40rem] md:w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-white to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-white to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-white to-transparent h-[5px] md:w-1/4 w-1/3 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-white to-transparent h-px md:w-1/4 w-1/3" />

        {/* Core component */}
        <SparklesCore
          background="#0A0A0A"
          minSize={0.3}
          maxSize={1}
          particleDensity={1200}
          className="md:w-full bg-[#0A0A0A] w-md mx-auto h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-[#0A0A0A] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}
