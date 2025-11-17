import { SparklesPreview } from "@/components/SparklePreview";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const page = () => {
  return (
    <div className="relative">

      {/* 🔥 Join Community Button ABOVE SparklesPreview */}
      <div className="flex justify-center mt-6">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-2"
        >
          <span>Join Our Community 🚀</span>
        </HoverBorderGradient>
      </div>

      {/* ⭐ Sparkles Preview Section */}
      <div className="mt-0">
        <SparklesPreview />
      </div>

      {/* 🌊 Ripple Background Hero Section */}
      <section className="pt-0">
        <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden">
          <BackgroundRippleEffect />

          <div className="mt-40 w-full">
            <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
              AI PDF Summarizer & Reel Formatter
            </h2>

            <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
              Upload your PDF and instantly convert it into short, clean summaries or reel-style content. Fast, smart and powered by AI.
            </p>

            {/* Get Started Button */}
            <div className="flex items-center justify-center mt-6 relative z-10">
              <button className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

    



    </div>
  );
};

export default page;
