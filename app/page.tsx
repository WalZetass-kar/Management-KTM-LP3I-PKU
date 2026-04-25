import { MainLandingSection } from "@/components/landing/main-landing-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <MainLandingSection />
      <Footer />
    </main>
  );
}
