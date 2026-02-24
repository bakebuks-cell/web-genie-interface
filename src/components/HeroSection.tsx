import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import UnifiedInput, { GenerationMode } from "./UnifiedInput";
import { HeroBackground } from "./HeroBackground";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import RecentProjectCard from "./RecentProjectCard";

// Language mapping for display names
const languageNames: Record<string, string> = {
  "html": "Plain HTML/CSS/JS",
  "php": "PHP",
  "nodejs": "Node/TS",
  "python": "Python",
  "golang": "Golang",
  "react": "React",
};

export const HeroSection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [multiStack, setMultiStack] = useState<string[]>([]);
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLanguageSelect = (language: string | null) => {
    setSelectedLanguage(language);
    if (language) {
      toast({
        title: "Language Selected",
        description: `You selected ${languageNames[language] || language}`,
      });
    }
  };

  const handleGenerate = (generationMode: GenerationMode) => {
    if (!idea.trim()) {
      toast({
        title: "Describe Your Application",
        description: "Please describe the application you want to build",
        variant: "destructive",
      });
      return;
    }

    // Navigate to generating page with full generation mode state
    navigate("/generating", { 
      state: { 
        language: generationMode.singleLanguage || generationMode.multiStack[0] || "react",
        idea,
        generationMode,
      } 
    });
  };

  return (
    <section className="relative pt-20 pb-8 md:pt-24 md:pb-12 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Premium background effects */}
      <HeroBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Quote with animations */}
        <div className="text-center mb-8 md:mb-10">
          {/* Main headline - stacked with animation */}
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Build fast.
          </motion.h1>
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            Ship lean.
          </motion.h1>

          {/* Animated decorative line */}
          <motion.div 
            className="flex justify-center mt-6 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{ 
                scaleX: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          
          {/* Supporting Quote */}
          <motion.p 
            className="text-muted-foreground text-sm md:text-base font-light tracking-wide max-w-lg mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
            >
              "Bringing clarity, speed, and precision to prompt-driven development"
            </motion.span>
          </motion.p>

          {/* Floating accent badges */}
          <motion.div 
            className="flex justify-center gap-3 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {["AI-Powered", "Multi-Stack", "Production Ready"].map((badge, i) => (
              <motion.span
                key={badge}
                className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full border border-primary/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "hsl(var(--primary) / 0.2)",
                  transition: { duration: 0.2 }
                }}
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Unified Input Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        >
          <UnifiedInput
            selectedLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
            idea={idea}
            onIdeaChange={setIdea}
            onGenerate={handleGenerate}
            multiStack={multiStack}
            onMultiStackChange={setMultiStack}
          />
        </motion.div>

        {/* Recent Project Card for logged-in users */}
        {user && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <RecentProjectCard />
          </motion.div>
        )}
      </div>
    </section>
  );
};
