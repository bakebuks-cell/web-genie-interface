import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import UnifiedInput, { GenerationMode } from "./UnifiedInput";
import { HeroBackground } from "./HeroBackground";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateProject } from "@/hooks/useProjects";
import { savePreAuthDraft, getPreAuthDraft, clearPreAuthDraft } from "@/lib/preAuthDraft";

// Language mapping for display names
const languageNames: Record<string, string> = {
  "html": "Plain HTML/CSS/JS",
  "php": "PHP",
  "nodejs": "Node/TS",
  "python": "Python",
  "golang": "Golang",
  "react": "React"
};

export const HeroSection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [multiStack, setMultiStack] = useState<string[]>([]);
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const createProject = useCreateProject();
  const hasResumed = useRef(false);

  // Resume generation from pre-auth draft after login
  useEffect(() => {
    if (!user || hasResumed.current) return;
    const draft = getPreAuthDraft();
    if (!draft) return;
    hasResumed.current = true;

    // Restore state and auto-navigate
    setIdea(draft.prompt);
    if (draft.mode === "single" && draft.singleLanguage) {
      setSelectedLanguage(draft.singleLanguage);
    } else if (draft.mode === "multi") {
      setMultiStack(draft.multiStack);
    }

    clearPreAuthDraft();

    const generationMode: GenerationMode = {
      mode: draft.mode,
      singleLanguage: draft.singleLanguage || undefined,
      multiStack: draft.multiStack
    };

    // Small delay to let state settle
    setTimeout(() => {
      navigate("/generating", {
        state: {
          language: draft.singleLanguage || draft.multiStack[0] || "react",
          idea: draft.prompt,
          generationMode
        }
      });
    }, 100);
  }, [user]);

  const handleLanguageSelect = (language: string | null) => {
    setSelectedLanguage(language);
    if (language) {
      toast({
        title: "Language Selected",
        description: `You selected ${languageNames[language] || language}`
      });
    }
  };

  const handleGenerate = async (generationMode: GenerationMode) => {
    if (!idea.trim()) {
      toast({
        title: "Describe Your Application",
        description: "Please describe the application you want to build",
        variant: "destructive"
      });
      return;
    }

    // Auth gate: redirect unauthenticated users
    if (!user) {
      savePreAuthDraft({
        prompt: idea,
        mode: generationMode.mode === "multi" ? "multi" : "single",
        singleLanguage: generationMode.singleLanguage || null,
        multiStack: generationMode.multiStack || []
      });
      navigate("/auth-gate");
      return;
    }

    // If logged in, create project in DB
    let dbProjectId: string | undefined;
    if (user) {
      try {
        // Derive a project name from prompt
        const name = idea.trim().slice(0, 60) || "Untitled Project";
        const project = await createProject.mutateAsync({
          name,
          prompt: idea,
          mode: generationMode.mode,
          single_language: generationMode.singleLanguage,
          multi_stack: generationMode.mode === "multi" ?
          { frontend: generationMode.multiStack.filter((s) => ["react", "html", "csharp"].includes(s)), backend: generationMode.multiStack.filter((s) => ["nodejs", "python", "golang", "php", "java"].includes(s)), database: [] } :
          { frontend: [], backend: [], database: [] },
          status: "generating"
        });
        dbProjectId = project.id;
      } catch (e) {
        console.error("Failed to save project:", e);
      }
    }


    navigate("/generating", {
      state: {
        language: generationMode.singleLanguage || generationMode.multiStack[0] || "react",
        idea,
        generationMode,
        dbProjectId
      }
    });
  };

  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Premium background effects */}
      <HeroBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
        {/* Centered Quote with animations */}
        <div className="text-center mb-12 md:mb-14">
          {/* Main headline - stacked with animation */}
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-foreground"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            Build fast.
          </motion.h1>
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-muted-foreground"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}>
            Ship lean.
          </motion.h1>

          {/* Animated decorative line */}
          <motion.div
            className="flex justify-center mt-6 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}>
            
            <motion.div
              className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{
                scaleX: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }} />
            
          </motion.div>
          
          {/* Supporting Quote */}
          <motion.p
            className="text-muted-foreground text-sm md:text-base font-light tracking-wide max-w-lg mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}>
            
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}>
              
              "Bringing clarity, speed, and precision to prompt-driven development"
            </motion.span>
          </motion.p>

          {/* Floating accent badges */}
          





















          
        </div>

        {/* Unified Input Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}>
          
          <UnifiedInput
            selectedLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
            idea={idea}
            onIdeaChange={setIdea}
            onGenerate={handleGenerate}
            multiStack={multiStack}
            onMultiStackChange={setMultiStack} />
          
        </motion.div>

      </div>
    </section>);

};