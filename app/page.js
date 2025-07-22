import Hero from "../components/Hero";
import FeaturedSections from "../components/FeaturedSections";
import SustainabilitySection from "../components/SustainabilitySection";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Hero />
        <FeaturedSections />
        <SustainabilitySection />
      </div>
    </div>
  );
}
