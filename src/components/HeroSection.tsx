import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import UnifiedInput, { GenerationMode } from "./UnifiedInput";
import { HeroBackground } from "./HeroBackground";
import { TextRotate } from "./ui/text-rotate";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateProject } from "@/hooks/useProjects";
import { savePreAuthDraft, getPreAuthDraft, clearPreAuthDraft } from "@/lib/preAuthDraft";
import { useGenerationStore } from "@/stores/useGenerationStore";

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
  const { user, isLoading } = useAuth();
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

    // Save intent to persistent store
    const genStore = useGenerationStore.getState();
    genStore.setIntent({
      prompt: draft.prompt,
      stack: draft.singleLanguage || draft.multiStack[0] || "react",
      mode: draft.mode,
      singleLanguage: draft.singleLanguage || null,
      multiStack: draft.multiStack,
      dbProjectId: null,
    });

    // Small delay to let state settle
    setTimeout(() => {
      navigate("/generate");
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

    if (isLoading) {
      toast({
        title: "Please wait",
        description: "Checking your account before creating the project.",
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

    if (!user.id) {
      console.error("Project save failed: userId is missing");
      toast({
        title: "User not authenticated",
        description: "Please log in and try again.",
        variant: "destructive",
      });
      return;
    }

    // Create project in DB — must succeed before navigating
    let dbProjectId: string | undefined;
    try {
      const name = idea.trim().slice(0, 60) || "Untitled Project";
      console.log("User ID:", user.id);
      const project = await createProject.mutateAsync({
        name,
        prompt: idea,
        mode: generationMode.mode,
        single_language: generationMode.singleLanguage || null,
        multi_stack: generationMode.mode === "multi"
          ? {
              frontend: generationMode.multiStack.filter((s) => ["react", "html", "csharp"].includes(s)),
              backend: generationMode.multiStack.filter((s) => ["nodejs", "python", "golang", "php", "java"].includes(s)),
              database: [],
            }
          : { frontend: [], backend: [], database: [] },
        status: "generating",
      });

      dbProjectId = project.id;
      console.log("Project created", dbProjectId);
    } catch (e) {
      console.error("Project save failed:", e);
      toast({
        title: "Project could not be saved",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Save generation intent to persistent store BEFORE navigating
    const genStore = useGenerationStore.getState();
    genStore.setIntent({
      prompt: idea,
      stack: generationMode.singleLanguage || generationMode.multiStack[0] || "react",
      mode: generationMode.mode,
      singleLanguage: generationMode.singleLanguage || null,
      multiStack: generationMode.multiStack || [],
      dbProjectId: dbProjectId || null,
    });

    console.log("[HeroSection] Generation intent saved, navigating to /generating");

    navigate("/generate");
  };

  return (
    <section className="relative overflow-hidden flex min-h-[calc(100svh-4.75rem)] flex-col justify-center pt-8 pb-8 md:min-h-[calc(100svh-5.5rem)] md:pt-10 md:pb-10 lg:pt-8 lg:pb-8">
      {/* Premium background effects */}
      <HeroBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
        {/* Centered Quote with animations */}
        <div className="text-center mb-7 md:mb-8 lg:mb-7">
          {/* Main headline with rotating text */}
          <motion.h1
            className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 md:gap-x-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            <span
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-none text-[#f5f5f5]">
              Build with
            </span>
            <span className="inline-flex h-[1.15em] items-center text-4xl md:text-5xl lg:text-6xl font-bold overflow-hidden">
              <TextRotate
                words={["speed", "precision", "style", "intelligence", "flow", "confidence"]}
                interval={2000}
                staggerDelay={0.035}
                className="text-primary drop-shadow-[0_0_18px_hsl(var(--primary)/0.35)]"
              />
            </span>
          </motion.h1>

          {/* Animated decorative line */}
          <motion.div
            className="flex justify-center mt-4 mb-3 md:mt-5 md:mb-4"
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
          id="hero-prompt-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="transition-all duration-500">
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