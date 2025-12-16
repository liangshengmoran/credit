"use client";

import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { FeaturesSection } from "@/components/home/features-section";
import { DeveloperSection } from "@/components/home/developer-section";
import { FooterSection } from "@/components/home/footer-section";

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-y-scroll snap-y snap-proximity bg-transparent text-foreground font-sans overflow-x-hidden selection:bg-primary selection:text-primary-foreground z-10 scrollbar-hide">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <DeveloperSection />
      <FooterSection />
    </div>
  )
}
