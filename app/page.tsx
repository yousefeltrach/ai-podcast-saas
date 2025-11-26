import HeroSection from "@/components/home/hero-section";
import Header from "@/components/home/header";
import FeatureSection from "@/components/home/feature-section";
import PricingSection from "@/components/home/pricing-section";
import CtaSection from "@/components/home/cta-section";
import Footer from "@/components/home/footer";

export default function Home() {
  return (
    <div >
      <Header />
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
