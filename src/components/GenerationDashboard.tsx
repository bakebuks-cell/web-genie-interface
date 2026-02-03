import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Circle, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { QuantumPulseLoader } from "@/components/ui/quantum-pulse-loader";
import { Card, CardContent } from "@/components/ui/card";

interface GenerationDashboardProps {
  language?: string;
  idea?: string;
  onComplete?: () => void;
}

type StepStatus = "pending" | "running" | "completed";

interface BuildStep {
  id: number;
  label: string;
  status: StepStatus;
  duration: number;
}

const initialSteps: BuildStep[] = [
  { id: 1, label: "Parsing user prompt", status: "pending", duration: 2000 },
  { id: 2, label: "Generating sitemap & routes", status: "pending", duration: 2500 },
  { id: 3, label: "Building UI components", status: "pending", duration: 3000 },
  { id: 4, label: "Applying theme & styling", status: "pending", duration: 2500 },
  { id: 5, label: "Preparing deployment bundle", status: "pending", duration: 2000 },
  { id: 6, label: "Finalizing output", status: "pending", duration: 2000 },
];

const GenerationDashboard = ({ language, idea, onComplete }: GenerationDashboardProps) => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<BuildStep[]>(initialSteps);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isComplete || hasStarted) return;
    setHasStarted(true);

    let currentIndex = 0;

    const runStep = (index: number) => {
      if (index >= initialSteps.length) {
        setIsComplete(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            navigate("/preview");
          }
        }, 500);
        return;
      }

      // Set current step to running
      setSteps((prev) =>
        prev.map((step, i) =>
          i === index ? { ...step, status: "running" } : step
        )
      );

      // After duration, mark as completed and start next
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) =>
            i === index ? { ...step, status: "completed" } : step
          )
        );
        runStep(index + 1);
      }, initialSteps[index].duration);
    };

    runStep(0);
  }, [isComplete, hasStarted, onComplete, navigate]);

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case "pending":
        return <Circle className="w-5 h-5 text-muted-foreground" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8">
          {/* Quantum Pulse Loader */}
          <div className="mb-10">
            <QuantumPulseLoader />
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  step.status === "running"
                    ? "bg-primary/5 border border-primary/20"
                    : step.status === "completed"
                    ? "bg-muted/30"
                    : "bg-transparent"
                }`}
              >
                {getStepIcon(step.status)}
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    step.status === "running"
                      ? "text-foreground"
                      : step.status === "completed"
                      ? "text-muted-foreground"
                      : "text-muted-foreground/60"
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Subtitle */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Please don't close this tab while we build your app.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerationDashboard;
