"use client";

import useEmblaCarousel from "embla-carousel-react";
import DummyStoryCard from "./DummyStoryCard";

const aiStories = [
  "Executive Summary: The uploaded PDF highlights the rapid adoption of AI across global industries. It explains how automation, data analysis, and intelligent decision-making are reshaping traditional business workflows.",
  "Market Insight: The report outlines a surge in enterprise AI investments during the last three years. Companies are shifting from experimental use cases to full-scale deployment, focusing on efficiency and operational accuracy.",
  "Technical Breakdown: The document provides an in-depth explanation of machine learning pipelines, data preprocessing requirements, model evaluation metrics, and integration challenges faced by mid-sized organizations.",
  "Final Assessment: The PDF concludes by emphasizing that AI is no longer optional. Businesses that adopt structured automation and analytics early gain measurable advantages in productivity, cost reduction, and strategic forecasting."
];

const webDevStories = [
  "Frontend Evolution: Modern web development has shifted dramatically toward component-based architectures. React, Vue, and Angular dominate the landscape, enabling developers to build scalable, maintainable user interfaces.",
  "Performance Matters: Web vitals like LCP, FID, and CLS are now critical ranking factors. Optimizing images, lazy loading, and minimizing JavaScript are essential for user experience and SEO.",
  "Full-Stack Integration: Next.js and similar frameworks blur the line between frontend and backend. Server-side rendering, API routes, and edge functions enable developers to build complete applications within one codebase.",
  "Future Trends: WebAssembly, micro-frontends, and progressive web apps are reshaping how we think about web applications. The browser is becoming a powerful platform for complex, native-like experiences."
];

const cybersecurityStories = [
  "Threat Landscape: Cyberattacks have increased 300% in the past two years. Ransomware, phishing, and supply chain attacks target businesses of all sizes, demanding robust security protocols.",
  "Zero Trust Architecture: Traditional perimeter-based security is obsolete. Modern organizations adopt zero trust principles—verify every user, device, and connection regardless of location.",
  "Data Privacy Regulations: GDPR, CCPA, and emerging global laws force companies to prioritize data protection. Non-compliance results in heavy fines and reputational damage.",
  "Security Automation: AI-driven security tools detect anomalies in real-time, respond to threats automatically, and reduce the burden on security teams. The future of cybersecurity is proactive, not reactive."
];

const startupStories = [
  "Lean Startup Philosophy: Build, measure, learn. Modern startups prioritize rapid iteration over perfect planning. MVPs allow founders to test assumptions and pivot based on real user feedback.",
  "Funding Landscape: Venture capital is more accessible than ever, but competition is fierce. Bootstrapping, angel investors, and crowdfunding offer alternative paths for early-stage companies.",
  "Product-Market Fit: Most startups fail not due to bad products, but because they solve problems nobody has. Finding PMF requires deep customer research, experimentation, and patience.",
  "Scaling Challenges: Growth introduces complexity. Hiring, maintaining culture, managing finances, and avoiding technical debt become critical as startups transition from 10 to 100+ employees."
];

const StoryCarousel = () => {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    loop: false,
  });

  return (
    <div className="w-full max-w-6xl mx-auto mt-16">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          <div className="flex-[0_0_380px]">
            <DummyStoryCard stories={aiStories} />
          </div>

          <div className="flex-[0_0_380px]">
            <DummyStoryCard stories={webDevStories} />
          </div>

          <div className="flex-[0_0_380px]">
            <DummyStoryCard stories={cybersecurityStories} />
          </div>

          <div className="flex-[0_0_380px]">
            <DummyStoryCard stories={startupStories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCarousel;
