"use client";

import useEmblaCarousel from "embla-carousel-react";
import StoryCard from "./StoryCard";

const StoryCarousel = () => {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    loop: false,
  });

  return (
    <div className="w-full max-w-6xl mx-auto mt-16">
      {/* Embla viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {/* Add as many story cards as you want */}
          <div className="flex-[0_0_380px]">
            <StoryCard />
          </div>

          <div className="flex-[0_0_380px]">
            <StoryCard />
          </div>

          <div className="flex-[0_0_380px]">
            <StoryCard />
          </div>

          <div className="flex-[0_0_380px]">
            <StoryCard />
          </div>

        </div>
      </div>
    </div>
  );
};

export default StoryCarousel;
