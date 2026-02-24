import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HeroBackground } from "@/components/HeroBackground";
import GenerationDashboard from "@/components/GenerationDashboard";

const GeneratingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, idea, generationMode } = location.state || {};

  // If no state, redirect home
  useEffect(() => {
    if (!language && !idea) {
      navigate("/", { replace: true });
    }
  }, [language, idea, navigate]);

  const handleComplete = () => {
    navigate("/generate", { state: { language, idea, generationMode }, replace: true });
  };

  if (!language && !idea) return null;

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center">
      <HeroBackground />
      <div className="relative z-10 w-full max-w-lg px-4">
        <GenerationDashboard
          language={language}
          idea={idea}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default GeneratingPage;
