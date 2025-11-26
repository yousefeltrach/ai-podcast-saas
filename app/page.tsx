import HeroSection from "@/components/home/hero-section";
import Header from "@/components/home/header";
import PricingSection from "@/components/home/pricing-section";
import CtaSection from "@/components/home/cta-section";
import Footer from "@/components/home/footer";
import { FeaturesSection } from "@/components/home/features-section";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
