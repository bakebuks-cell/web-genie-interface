import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Sparkles, Code2, Palette, Rocket, FileText, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface GenerationStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

interface GenerationProgressProps {
  language: string;
  idea: string;
  onComplete?: () => void;
  onOpenApp?: () => void;
  onGenerateAgain?: () => void;
  // For future backend integration
  externalProgress?: number;
  externalSteps?: { id: string; completed: boolean }[];
  isExternallyControlled?: boolean;
}

const GENERATION_STEPS = [
  { id: "reading", label: "Reading your prompt", icon: <FileText className="w-4 h-4" /> },
  { id: "planning", label: "Planning pages & layout", icon: <Layout className="w-4 h-4" /> },
  { id: "generating", label: "Generating UI components", icon: <Code2 className="w-4 h-4" /> },
  { id: "styling", label: "Adding styles & theme", icon: <Palette className="w-4 h-4" /> },
  { id: "finalizing", label: "Finalizing & optimizing", icon: <Rocket className="w-4 h-4" /> },
  { id: "done", label: "Done 🎉", icon: <Sparkles className="w-4 h-4" /> },
];

const GenerationProgress = ({
  language,
  idea,
  onComplete,
  onOpenApp,
  onGenerateAgain,
  externalProgress,
  externalSteps,
  isExternallyControlled = false,
}: GenerationProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Mock generation logic - runs automatically
  useEffect(() => {
    if (isExternallyControlled) return;

    const totalDuration = 25000; // 25 seconds
    const intervalMs = 100;
    const incrementPerInterval = 100 / (totalDuration / intervalMs);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + incrementPerInterval, 100);
        
        // Update current step based on progress
        if (newProgress < 15) setCurrentStepIndex(0);
        else if (newProgress < 35) setCurrentStepIndex(1);
        else if (newProgress < 55) setCurrentStepIndex(2);
        else if (newProgress < 75) setCurrentStepIndex(3);
        else if (newProgress < 95) setCurrentStepIndex(4);
        else setCurrentStepIndex(5);

        if (newProgress >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }

        return newProgress;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isExternallyControlled, onComplete]);

  // Use external progress if controlled externally
  useEffect(() => {
    if (isExternallyControlled && externalProgress !== undefined) {
      setProgress(externalProgress);
      if (externalProgress >= 100) {
        setIsComplete(true);
        setCurrentStepIndex(5);
      }
    }
  }, [isExternallyControlled, externalProgress]);

  // Build steps with status
  const steps: GenerationStep[] = GENERATION_STEPS.map((step, index) => ({
    ...step,
    completed: isExternallyControlled 
      ? (externalSteps?.find(s => s.id === step.id)?.completed ?? index < currentStepIndex)
      : index < currentStepIndex || (index === currentStepIndex && isComplete),
    active: index === currentStepIndex && !isComplete,
  }));

  // Extract app name from idea or use default
  const appName = idea?.split(" ").slice(0, 3).join(" ") || "Your App";

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Main Card */}
        <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-sm overflow-hidden">
          {/* Shimmer top border */}
          <div className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      >
                        <Check className="w-8 h-8 text-primary" />
                      </motion.div>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Your app is ready!
                    </h2>
                    <p className="text-muted-foreground">
                      Your application has been generated successfully.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center relative">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      {/* Pulse ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/30"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Generating your application…
                    </h2>
                    <p className="text-muted-foreground">
                      This may take a few moments. We're building your app from your prompt.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3" />
                {/* Shimmer overlay */}
                {!isComplete && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>
              {!isComplete && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Estimated time: ~20–40 seconds
                </p>
              )}
            </div>

            {/* Steps Checklist */}
            <div className="space-y-3 mb-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    step.completed
                      ? "bg-primary/10 border border-primary/20"
                      : step.active
                      ? "bg-muted border border-border"
                      : "bg-transparent border border-transparent"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step.completed
                        ? "bg-primary text-primary-foreground"
                        : step.active
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="w-4 h-4" />
                    ) : step.active ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      step.completed
                        ? "text-foreground"
                        : step.active
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* App Blueprint Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-muted/50 border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">App Blueprint</h4>
                <Badge variant={isComplete ? "default" : "secondary"} className="text-xs">
                  {isComplete ? "Ready" : "Building"}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">App Name</span>
                  <span className="text-foreground font-medium truncate max-w-[200px]">
                    {appName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stack</span>
                  <span className="text-foreground font-medium">{language}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className={`w-2 h-2 rounded-full ${
                        isComplete ? "bg-primary" : "bg-amber-500"
                      }`}
                      animate={!isComplete ? { opacity: [1, 0.5, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-foreground font-medium">
                      {isComplete ? "Complete" : "In Progress"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons - Show when complete */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    onClick={onOpenApp}
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Open Application
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onGenerateAgain}
                    className="flex-1 h-12 text-base"
                  >
                    Generate Again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default GenerationProgress;
