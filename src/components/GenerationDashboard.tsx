import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface GenerationDashboardProps {
  language: string;
  idea: string;
  onComplete?: () => void;
  onOpenApp?: () => void;
  onGenerateAgain?: () => void;
  externalProgress?: number;
  isExternallyControlled?: boolean;
}

const BUILD_STEPS = [
  { id: "understanding", label: "Understanding your request" },
  { id: "pages", label: "Setting up pages & layout" },
  { id: "components", label: "Designing UI components" },
  { id: "interactions", label: "Adding interactions" },
  { id: "finalizing", label: "Finalizing & preparing preview" },
];

const GenerationDashboard = ({
  language,
  idea,
  onComplete,
  onOpenApp,
  onGenerateAgain,
  externalProgress,
  isExternallyControlled = false,
}: GenerationDashboardProps) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Mock generation logic - 15 seconds total
  useEffect(() => {
    if (isExternallyControlled) return;

    const totalDuration = 15000;
    const intervalMs = 50;
    const incrementPerInterval = 100 / (totalDuration / intervalMs);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + incrementPerInterval, 100);

        // Update step based on progress
        if (newProgress < 15) setCurrentStepIndex(0);
        else if (newProgress < 35) setCurrentStepIndex(1);
        else if (newProgress < 60) setCurrentStepIndex(2);
        else if (newProgress < 85) setCurrentStepIndex(3);
        else setCurrentStepIndex(4);

        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsComplete(true);
          onComplete?.();
        }

        return newProgress;
      });
    }, intervalMs);

    return () => {
      clearInterval(progressInterval);
    };
  }, [isExternallyControlled, onComplete]);

  // External control handling
  useEffect(() => {
    if (isExternallyControlled && externalProgress !== undefined) {
      setProgress(externalProgress);
      if (externalProgress >= 100) {
        setIsComplete(true);
      }
    }
  }, [isExternallyControlled, externalProgress]);

  const handleOpenApp = () => {
    if (onOpenApp) {
      onOpenApp();
    } else {
      navigate("/app");
    }
  };

  const handleGenerateAgain = () => {
    if (onGenerateAgain) {
      onGenerateAgain();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-border bg-card">
                  <CardContent className="p-8 text-center">
                    {/* Success Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                      <Check className="w-8 h-8 text-primary" />
                    </motion.div>

                    <h1 className="text-2xl font-semibold text-foreground mb-2">
                      Your application is ready!
                    </h1>
                    <p className="text-muted-foreground mb-8">
                      You can now preview your app or start a new generation.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        size="lg"
                        onClick={handleOpenApp}
                        className="h-12 px-6"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Preview
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleGenerateAgain}
                        className="h-12 px-6"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="building"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-border bg-card">
                  <CardContent className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-semibold text-foreground mb-2">
                        Creating your application…
                      </h1>
                      <p className="text-muted-foreground">
                        This will take a few seconds. Please don't close the tab.
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-lg font-semibold text-foreground">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={progress} className="h-2" />
                        {/* Shimmer overlay */}
                        <motion.div
                          className="absolute inset-0 h-2 rounded-full overflow-hidden"
                          style={{ width: `${progress}%` }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3 mb-8">
                      {BUILD_STEPS.map((step, index) => {
                        const isCompleted = index < currentStepIndex || (index === currentStepIndex && isComplete);
                        const isActive = index === currentStepIndex && !isComplete;
                        const isPending = index > currentStepIndex;

                        return (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              isActive ? "bg-secondary" : ""
                            }`}
                          >
                            {/* Status Icon */}
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                                isCompleted
                                  ? "bg-primary text-primary-foreground"
                                  : isActive
                                  ? "bg-primary/20"
                                  : "bg-muted"
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : isActive ? (
                                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                              )}
                            </div>

                            {/* Label */}
                            <span
                              className={`text-sm transition-colors ${
                                isCompleted
                                  ? "text-foreground"
                                  : isActive
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Preview Skeleton */}
                    <div className="border border-border rounded-lg p-4 bg-secondary/30">
                      <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
                        Preview
                      </p>
                      <div className="space-y-3">
                        {/* Header skeleton */}
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-20 bg-muted rounded animate-shimmer" />
                          <div className="flex gap-2">
                            <div className="h-4 w-12 bg-muted rounded animate-shimmer" />
                            <div className="h-4 w-12 bg-muted rounded animate-shimmer" />
                            <div className="h-4 w-12 bg-muted rounded animate-shimmer" />
                          </div>
                        </div>
                        
                        {/* Hero skeleton */}
                        <div className="h-16 bg-muted rounded animate-shimmer" />
                        
                        {/* Cards skeleton */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-12 bg-muted rounded animate-shimmer" />
                          <div className="h-12 bg-muted rounded animate-shimmer" />
                          <div className="h-12 bg-muted rounded animate-shimmer" />
                        </div>

                        {/* Button skeleton */}
                        <div className="flex justify-center">
                          <div className="h-8 w-24 bg-muted rounded animate-shimmer" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GenerationDashboard;
