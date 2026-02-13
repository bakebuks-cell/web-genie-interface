import { HeroSection } from "@/components/HeroSection";
import { ParticleBackground } from "@/components/ParticleBackground";

const Index = () => {
  return (
    <div className="min-h-screen w-full relative">
      <ParticleBackground />
      <main>
        <HeroSection />
      </main>
    </div>
  );
};

export default Index;
