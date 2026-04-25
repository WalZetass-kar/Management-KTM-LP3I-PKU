import { HeroSection } from "@/components/landing/hero-section";
import { HowToSection } from "@/components/landing/how-to-section";
import { FAQSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/landing/footer";

export default function MahasiswaKTMPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowToSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
