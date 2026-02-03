import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import FuturisticHeader from "./FuturisticHeader";
import ProgressRing from "./ProgressRing";
import NeuralActivity from "./NeuralActivity";
import LiveConsole from "./LiveConsole";
import LivePreviewSkeleton from "./LivePreviewSkeleton";
import BlueprintPanel from "./BlueprintPanel";
import SuccessScreen from "./SuccessScreen";

type BuildStatus = "initializing" | "analyzing" | "building" | "optimizing" | "deploying" | "ready";

interface GenerationDashboardProps {
  idea: string;
  isGenerating: boolean;
  generatedUrl?: string;
  onCancel?: () => void;
  onGenerateAnother?: () => void;
}

const BUILD_LOGS = [
  "[00:01] Booting AI engine...",
  "[00:02] Initializing neural processors...",
  "[00:03] Parsing prompt → OK",
  "[00:05] Analyzing intent patterns...",
  "[00:07] Detecting required pages...",
  "[00:09] Mapping component architecture...",
  "[00:11] Generating base structure...",
  "[00:14] Creating navigation system...",
  "[00:17] Building UI components...",
  "[00:20] Applying responsive layouts...",
  "[00:23] Styling with premium UI system...",
  "[00:26] Injecting animations & transitions...",
  "[00:28] Optimizing render performance...",
  "[00:30] Minifying assets...",
  "[00:32] Running accessibility checks...",
  "[00:34] Preparing deploy bundle...",
  "[00:36] Deploy bundle prepared",
  "[00:38] Build complete ✅",
];

const STATUS_TIMELINE: { threshold: number; status: BuildStatus; text: string }[] = [
  { threshold: 0, status: "initializing", text: "Initializing AI Engine" },
  { threshold: 10, status: "analyzing", text: "Analyzing Prompt" },
  { threshold: 25, status: "building", text: "Building UI Components" },
  { threshold: 60, status: "optimizing", text: "Optimizing Performance" },
  { threshold: 85, status: "deploying", text: "Deploying Bundle" },
  { threshold: 100, status: "ready", text: "Ready" },
];

const GenerationDashboard = ({
  idea,
  isGenerating,
  generatedUrl,
  onCancel,
  onGenerateAnother,
}: GenerationDashboardProps) => {
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const totalDuration = 30; // seconds
  const eta = Math.max(0, totalDuration - elapsedTime);

  // Get current status based on progress
  const getCurrentStatus = useCallback((): { status: BuildStatus; text: string } => {
    for (let i = STATUS_TIMELINE.length - 1; i >= 0; i--) {
      if (progress >= STATUS_TIMELINE[i].threshold) {
        return STATUS_TIMELINE[i];
      }
    }
    return STATUS_TIMELINE[0];
  }, [progress]);

  // Extract app name from idea
  const getAppName = useCallback((): string => {
    if (!idea) return "Your App";
    const words = idea.split(" ").slice(0, 3);
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }, [idea]);

  // Progress simulation
  useEffect(() => {
    if (!isGenerating || isComplete || isCancelled) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsComplete(true);
          return 100;
        }
        // Slightly randomized progress for realism
        const increment = 2 + Math.random() * 2;
        return Math.min(prev + increment, 100);
      });
    }, 600);

    return () => clearInterval(progressInterval);
  }, [isGenerating, isComplete, isCancelled]);

  // Elapsed time counter
  useEffect(() => {
    if (!isGenerating || isComplete || isCancelled) return;

    const timeInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [isGenerating, isComplete, isCancelled]);

  // Log simulation
  useEffect(() => {
    if (!isGenerating || isCancelled) return;

    const logIndex = Math.floor((progress / 100) * BUILD_LOGS.length);
    if (logIndex > logs.length && logIndex <= BUILD_LOGS.length) {
      setLogs(BUILD_LOGS.slice(0, logIndex));
    }
  }, [progress, isGenerating, isCancelled, logs.length]);

  const handleCancel = () => {
    setIsCancelled(true);
    onCancel?.();
  };

  const handleGenerateAnother = () => {
    setProgress(0);
    setElapsedTime(0);
    setLogs([]);
    setIsComplete(false);
    setIsCancelled(false);
    onGenerateAnother?.();
  };

  const currentStatus = getCurrentStatus();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ top: "-10%", left: "-10%" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{ bottom: "-10%", right: "-10%" }}
        />
      </div>

      {/* Success Screen Overlay */}
      <AnimatePresence>
        {isComplete && (
          <SuccessScreen
            onGenerateAnother={handleGenerateAnother}
            generatedUrl={generatedUrl}
          />
        )}
      </AnimatePresence>

      {/* Main content (hidden when complete) */}
      {!isComplete && (
        <>
          {/* Header */}
          <FuturisticHeader
            status={currentStatus.status}
            elapsedTime={elapsedTime}
            eta={eta}
          />

          {/* Scrollable content area */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left column */}
              <div>
                <ProgressRing
                  progress={progress}
                  statusText={currentStatus.text}
                />
                <NeuralActivity />
                <LiveConsole logs={logs} isComplete={isComplete} />
              </div>

              {/* Right column */}
              <div>
                <LivePreviewSkeleton progress={progress} />
                <BlueprintPanel appName={getAppName()} progress={progress} />
              </div>
            </div>
          </ScrollArea>

          {/* Bottom cancel button */}
          {!isComplete && !isCancelled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border-t border-slate-800/50 flex justify-center"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Build
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default GenerationDashboard;
