import Hero from "../components/Hero";
import FeaturedSections from "../components/FeaturedSections";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedSections />
    </div>
  );
}
