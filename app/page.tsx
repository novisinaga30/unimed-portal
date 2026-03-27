import FeatureHighlight from "@/components/FeatureHighlight";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import LandingStats from "@/components/LandingStats";
import Navbar from "@/components/Navbar";
import TestimonialSection from "@/components/TestimonialSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LandingStats />
      <FeatureHighlight />
      <HowItWorks />
      <TestimonialSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}