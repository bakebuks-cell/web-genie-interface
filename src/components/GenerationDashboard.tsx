import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Loader2, 
  Sparkles, 
  Code2, 
  Palette, 
  Rocket, 
  FileText, 
  Layout, 
  Terminal,
  Globe,
  Zap,
  Smartphone,
  Package,
  Clock,
  Play,
  ExternalLink,
  RefreshCw,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface BuildStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: "pending" | "running" | "completed";
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning";
}

interface GenerationDashboardProps {
  language: string;
  idea: string;
  onComplete?: () => void;
  onOpenApp?: () => void;
  onGenerateAgain?: () => void;
  // For future backend integration
  externalProgress?: number;
  externalSteps?: { id: string; status: "pending" | "running" | "completed" }[];
  externalLogs?: LogEntry[];
  isExternallyControlled?: boolean;
}

const BUILD_STEPS = [
  { id: "parsing", label: "Parsing user prompt", icon: <FileText className="w-4 h-4" /> },
  { id: "sitemap", label: "Generating sitemap & routes", icon: <Layout className="w-4 h-4" /> },
  { id: "components", label: "Building UI components", icon: <Code2 className="w-4 h-4" /> },
  { id: "styling", label: "Applying theme & styling", icon: <Palette className="w-4 h-4" /> },
  { id: "bundle", label: "Preparing deployment bundle", icon: <Package className="w-4 h-4" /> },
  { id: "finalizing", label: "Finalizing output", icon: <Rocket className="w-4 h-4" /> },
];

const MOCK_LOGS: { time: number; message: string; type: "info" | "success" | "warning" }[] = [
  { time: 1, message: "Initializing build environment...", type: "info" },
  { time: 2, message: "Reading prompt...", type: "info" },
  { time: 4, message: "Analyzing project requirements...", type: "info" },
  { time: 6, message: "Creating pages: Home, About, Contact...", type: "info" },
  { time: 8, message: "Setting up routing structure...", type: "info" },
  { time: 10, message: "Generating Header component...", type: "info" },
  { time: 11, message: "Generating Footer component...", type: "info" },
  { time: 12, message: "Generating Hero section...", type: "info" },
  { time: 14, message: "Building responsive layouts...", type: "info" },
  { time: 16, message: "Applying color palette...", type: "info" },
  { time: 17, message: "Configuring typography...", type: "info" },
  { time: 18, message: "Optimizing layout structure...", type: "info" },
  { time: 20, message: "Creating production bundle...", type: "info" },
  { time: 22, message: "Minifying assets...", type: "info" },
  { time: 24, message: "Running final optimizations...", type: "info" },
  { time: 25, message: "Build completed successfully ✅", type: "success" },
];

const GENERATED_PAGES = ["Home", "About", "Services", "Contact", "Blog", "FAQ"];
const FEATURES = ["Responsive UI", "Modern Components", "Fast Performance", "SEO Ready", "Accessible"];

const GenerationDashboard = ({
  language,
  idea,
  onComplete,
  onOpenApp,
  onGenerateAgain,
  externalProgress,
  externalSteps,
  externalLogs,
  isExternallyControlled = false,
}: GenerationDashboardProps) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-scroll console
  const scrollToBottom = useCallback(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  // Mock generation logic
  useEffect(() => {
    if (isExternallyControlled) return;

    const totalDuration = 25000;
    const intervalMs = 100;
    const incrementPerInterval = 100 / (totalDuration / intervalMs);

    // Timer
    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + incrementPerInterval, 100);

        // Update step based on progress
        if (newProgress < 12) setCurrentStepIndex(0);
        else if (newProgress < 28) setCurrentStepIndex(1);
        else if (newProgress < 48) setCurrentStepIndex(2);
        else if (newProgress < 68) setCurrentStepIndex(3);
        else if (newProgress < 88) setCurrentStepIndex(4);
        else setCurrentStepIndex(5);

        if (newProgress >= 100) {
          clearInterval(progressInterval);
          clearInterval(timerInterval);
          setIsComplete(true);
          setShowConfetti(true);
          onComplete?.();
          setTimeout(() => setShowConfetti(false), 3000);
        }

        return newProgress;
      });
    }, intervalMs);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
    };
  }, [isExternallyControlled, onComplete]);

  // Mock logs generation
  useEffect(() => {
    if (isExternallyControlled) return;

    MOCK_LOGS.forEach((log) => {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          {
            timestamp: formatTime(log.time),
            message: log.message,
            type: log.type,
          },
        ]);
      }, log.time * 1000);
    });
  }, [isExternallyControlled]);

  // External control handling
  useEffect(() => {
    if (isExternallyControlled && externalProgress !== undefined) {
      setProgress(externalProgress);
      if (externalProgress >= 100) {
        setIsComplete(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [isExternallyControlled, externalProgress]);

  useEffect(() => {
    if (isExternallyControlled && externalLogs) {
      setLogs(externalLogs);
    }
  }, [isExternallyControlled, externalLogs]);

  // Build steps with status
  const steps: BuildStep[] = BUILD_STEPS.map((step, index) => ({
    ...step,
    status: isExternallyControlled
      ? (externalSteps?.find((s) => s.id === step.id)?.status ?? "pending")
      : index < currentStepIndex
      ? "completed"
      : index === currentStepIndex
      ? isComplete
        ? "completed"
        : "running"
      : "pending",
  }));

  // Extract app name from idea
  const appName = idea?.split(" ").slice(0, 4).join(" ") || "Your App";

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
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
                initial={{ y: -20, opacity: 1 }}
                animate={{
                  y: "100vh",
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="flex-1 overflow-auto p-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success State */}
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Success Header */}
                <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-primary" />
                  <CardContent className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                      <Sparkles className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-foreground mb-3">
                      Your app is ready! 🎉
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">
                      You can now preview it or generate another one.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        size="lg"
                        onClick={handleOpenApp}
                        className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Open Application
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleGenerateAgain}
                        className="h-14 px-8 text-lg"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Generate Again
                      </Button>
                      <Button
                        size="lg"
                        variant="ghost"
                        disabled
                        className="h-14 px-8 text-lg opacity-50 cursor-not-allowed"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Build
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Completion Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                    <CardContent className="p-4 text-center">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold text-foreground">{formatTime(elapsedSeconds)}</p>
                      <p className="text-sm text-muted-foreground">Build Time</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                    <CardContent className="p-4 text-center">
                      <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold text-foreground">{GENERATED_PAGES.length}</p>
                      <p className="text-sm text-muted-foreground">Pages Created</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                    <CardContent className="p-4 text-center">
                      <Code2 className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold text-foreground">12</p>
                      <p className="text-sm text-muted-foreground">Components</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="building"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Header Section */}
                <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-2xl font-bold text-foreground">
                            Generating your application
                          </h1>
                          <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                            <motion.span
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="flex items-center gap-1"
                            >
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              Building
                            </motion.span>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Please wait — we're turning your prompt into a working web app.
                        </p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-muted-foreground">Elapsed</p>
                          <p className="text-xl font-mono font-bold text-foreground">
                            {formatTime(elapsedSeconds)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">ETA</p>
                          <p className="text-xl font-mono font-bold text-foreground">~20-40s</p>
                        </div>
                        <motion.div
                          className="flex gap-1"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Section */}
                <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Build Progress</h3>
                      <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={progress} className="h-4" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Steps Section */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        Build Pipeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {steps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                            step.status === "completed"
                              ? "bg-primary/10 border border-primary/20"
                              : step.status === "running"
                              ? "bg-amber-500/10 border border-amber-500/20"
                              : "bg-muted/30 border border-transparent"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              step.status === "completed"
                                ? "bg-primary text-primary-foreground"
                                : step.status === "running"
                                ? "bg-amber-500/20 text-amber-600"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step.status === "completed" ? (
                              <Check className="w-4 h-4" />
                            ) : step.status === "running" ? (
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
                            className={`text-sm font-medium ${
                              step.status === "completed" || step.status === "running"
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </span>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Console Logs Section */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-primary" />
                        Live Build Logs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        ref={consoleRef}
                        className="bg-zinc-950 rounded-lg p-4 h-[280px] overflow-y-auto font-mono text-sm border border-zinc-800"
                      >
                        {logs.map((log, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-2 mb-1 ${
                              log.type === "success"
                                ? "text-green-400"
                                : log.type === "warning"
                                ? "text-amber-400"
                                : "text-zinc-400"
                            }`}
                          >
                            <span className="text-zinc-600">[{log.timestamp}]</span>
                            <span>{log.message}</span>
                          </motion.div>
                        ))}
                        {!isComplete && (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-2 h-4 bg-primary ml-1"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* App Blueprint Card */}
                <Card className="border-border/50 bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-xl shadow-lg overflow-hidden">
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      App Blueprint
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* App Info */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">App Name</p>
                          <p className="font-semibold text-foreground truncate">{appName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Tech Stack</p>
                          <p className="font-semibold text-foreground">{language}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Status</p>
                          <div className="flex items-center gap-2">
                            <motion.span
                              className="w-2 h-2 rounded-full bg-amber-500"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="font-semibold text-foreground">Building</span>
                          </div>
                        </div>
                      </div>

                      {/* Generated Pages */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Generated Pages</p>
                        <div className="flex flex-wrap gap-2">
                          {GENERATED_PAGES.map((page) => (
                            <Badge
                              key={page}
                              variant="secondary"
                              className="bg-muted/50 text-foreground"
                            >
                              {page}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Features</p>
                        <div className="flex flex-wrap gap-2">
                          {FEATURES.map((feature) => (
                            <Badge
                              key={feature}
                              className="bg-primary/10 text-primary border-primary/20"
                            >
                              {feature === "Responsive UI" && <Smartphone className="w-3 h-3 mr-1" />}
                              {feature === "Fast Performance" && <Zap className="w-3 h-3 mr-1" />}
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Skeleton Preview */}
                    <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-xs text-muted-foreground mb-3">Preview Skeleton</p>
                      <div className="space-y-2">
                        <div className="h-8 bg-muted/50 rounded-lg w-full animate-pulse" />
                        <div className="flex gap-2">
                          <div className="h-24 bg-muted/50 rounded-lg flex-1 animate-pulse" />
                          <div className="h-24 bg-muted/50 rounded-lg flex-1 animate-pulse" />
                          <div className="h-24 bg-muted/50 rounded-lg flex-1 animate-pulse" />
                        </div>
                        <div className="h-12 bg-muted/50 rounded-lg w-2/3 animate-pulse" />
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
