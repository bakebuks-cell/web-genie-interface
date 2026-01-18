import { useState, useEffect } from "react";
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  language: string;
  idea: string;
}

const PreviewPanel = ({ language, idea }: PreviewPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getPreviewWidth = () => {
    switch (viewMode) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "w-full";
    }
  };

  const steps = [
    { threshold: 20, label: "Analyzing requirements..." },
    { threshold: 40, label: "Setting up project structure..." },
    { threshold: 60, label: "Generating components..." },
    { threshold: 80, label: "Applying styles..." },
    { threshold: 100, label: "Finalizing application..." },
  ];

  return (
    <div className="h-full flex flex-col bg-background/50">
      {/* Toolbar */}
      <div className="p-4 border-b border-border/50 glass flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[
            { mode: "desktop" as const, icon: Monitor },
            { mode: "tablet" as const, icon: Tablet },
            { mode: "mobile" as const, icon: Smartphone },
          ].map(({ mode, icon: Icon }) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode(mode)}
              className={`
                rounded-lg transition-all duration-300
                ${viewMode === mode 
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow" 
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-lg text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg text-muted-foreground hover:text-foreground">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Preview area */}
      <div className="flex-1 p-4 overflow-auto flex items-start justify-center">
        <div className={`${getPreviewWidth()} h-full mx-auto transition-all duration-300`}>
          {isLoading ? (
            <div className="h-full glass-card rounded-2xl border border-border/50 flex flex-col items-center justify-center p-8">
              {/* Animated loader */}
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-border/30" />
                <div 
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
                  style={{ animationDuration: "1s" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-pulse" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Building your application...
              </h3>
              <p className="text-sm text-muted-foreground mb-8 text-center max-w-md">
                Creating a <span className="text-primary font-medium">{language}</span> application
              </p>
              
              {/* Progress bar */}
              <div className="w-full max-w-xs mb-8">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 rounded-full"
                    style={{ 
                      width: `${progress}%`,
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s linear infinite"
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">{progress}% complete</p>
              </div>
              
              {/* Steps */}
              <div className="space-y-3 text-sm">
                {steps.map((step, index) => (
                  <p 
                    key={index}
                    className={`
                      flex items-center gap-2 transition-all duration-300
                      ${progress >= step.threshold ? "text-primary" : "text-muted-foreground/50"}
                    `}
                  >
                    <span className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-xs
                      ${progress >= step.threshold 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-muted-foreground"
                      }
                    `}>
                      {progress >= step.threshold ? "✓" : index + 1}
                    </span>
                    {step.label}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full glass-card rounded-2xl border border-border/50 overflow-hidden">
              {/* Simulated generated app preview */}
              <div className="h-14 bg-secondary/50 border-b border-border/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-muted/50 rounded-lg max-w-xs" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="h-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg w-3/4" />
                  <div className="h-4 bg-muted/50 rounded w-1/2" />
                  
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-border/30" />
                    <div className="h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-xl border border-border/30" />
                    <div className="h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-border/30" />
                  </div>
                  
                  <div className="mt-8 space-y-3">
                    <div className="h-4 bg-muted/50 rounded w-full" />
                    <div className="h-4 bg-muted/50 rounded w-5/6" />
                    <div className="h-4 bg-muted/50 rounded w-4/6" />
                  </div>
                  
                  <div className="flex gap-3 mt-8">
                    <div className="h-10 bg-gradient-to-r from-primary to-accent rounded-lg w-32" />
                    <div className="h-10 bg-muted/50 rounded-lg w-32 border border-border/30" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
