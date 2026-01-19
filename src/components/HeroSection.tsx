import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import UnifiedInput from "./UnifiedInput";
import { HeroBackground } from "./HeroBackground";
import { useToast } from "@/hooks/use-toast";

// Language mapping for display names
const languageNames: Record<string, string> = {
  "php": "PHP",
  "java-spring": "Java Spring Boot",
  "python-django": "Python Django",
  "aspnet": "ASP.NET",
  "nodejs-react": "Node.js + React",
};

export const HeroSection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    toast({
      title: "Language Selected",
      description: `You selected ${languageNames[language] || language}`,
    });
  };

  const handleGenerate = () => {
    if (!selectedLanguage) {
      toast({
        title: "Select a Language",
        description: "Please select a programming language first",
        variant: "destructive",
      });
      return;
    }
    
    if (!idea.trim()) {
      toast({
        title: "Describe Your Application",
        description: "Please describe the application you want to build",
        variant: "destructive",
      });
      return;
    }

    // Navigate to generation page with state
    navigate("/generate", { state: { language: selectedLanguage, idea } });
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-[80vh] flex items-center">
      {/* Premium background effects */}
      <HeroBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Quote - Two separate lines */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Build fast.
          </motion.h1>
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground/60 leading-tight mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Ship lean.
          </motion.h1>
        </motion.div>

        {/* Unified Input Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <UnifiedInput
            selectedLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
            idea={idea}
            onIdeaChange={setIdea}
            onGenerate={handleGenerate}
          />
        </motion.div>
      </div>
    </section>
  );
};
