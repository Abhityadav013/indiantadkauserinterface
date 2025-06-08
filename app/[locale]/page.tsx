import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HoursSection from "@/components/HoursSection";
import LocationSection from "@/components/LocationSection";
import OffersSection from "@/components/OffersSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <HoursSection />
      <OffersSection />
      <LocationSection />      
      <TestimonialsSection />
      <FooterSection />
    </main>
  );
}
