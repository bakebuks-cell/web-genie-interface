import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { GeneratorSection } from "@/components/GeneratorSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <GeneratorSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
