import { HeroSection } from "@/components/HeroSection";
import { useAuth } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";

const LandingSections = lazy(() => import("@/components/landing/LandingSections"));

const Index = () => {
  const { user, isLoading } = useAuth();
  const showMarketing = !isLoading && !user;

  return (
    <>
      <HeroSection />
      {showMarketing && (
        <Suspense fallback={null}>
          <LandingSections />
        </Suspense>
      )}
    </>
  );
};

export default Index;
