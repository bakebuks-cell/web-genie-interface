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
        {/* Quote with animation */}
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light italic max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            "Build powerful web applications from simple ideas."
          </motion.p>
          <motion.div 
            className="h-px w-32 mx-auto mt-6 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 128, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
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
