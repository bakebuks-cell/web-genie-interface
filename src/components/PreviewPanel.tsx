import { useState, useEffect } from "react";
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink } from "lucide-react";
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

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="flex-1 p-4 overflow-auto flex items-start justify-center">
        <div className={`${getPreviewWidth()} h-full mx-auto transition-all duration-300`}>
          {isLoading ? (
            <div className="h-full bg-card rounded-2xl border border-border flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Generating your application...
              </h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                Building a <span className="text-primary font-medium">{language}</span> application based on your idea
              </p>
              
              <div className="w-full max-w-xs">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent-purple transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">{progress}% complete</p>
              </div>
              
              <div className="mt-8 space-y-2 text-sm text-muted-foreground">
                <p className={progress > 20 ? "text-primary" : ""}>✓ Analyzing requirements...</p>
                <p className={progress > 40 ? "text-primary" : ""}>✓ Setting up project structure...</p>
                <p className={progress > 60 ? "text-primary" : ""}>✓ Generating components...</p>
                <p className={progress > 80 ? "text-primary" : ""}>✓ Applying styles...</p>
                <p className={progress >= 100 ? "text-primary" : ""}>✓ Finalizing application...</p>
              </div>
            </div>
          ) : (
            <div className="h-full bg-card rounded-2xl border border-border overflow-hidden">
              {/* Simulated generated app preview */}
              <div className="h-14 bg-primary/5 border-b border-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-muted rounded-lg max-w-xs" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded-lg w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="h-24 bg-primary/10 rounded-xl" />
                    <div className="h-24 bg-primary/10 rounded-xl" />
                    <div className="h-24 bg-primary/10 rounded-xl" />
                  </div>
                  
                  <div className="mt-8 space-y-3">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                    <div className="h-4 bg-muted rounded w-4/6" />
                  </div>
                  
                  <div className="flex gap-3 mt-8">
                    <div className="h-10 bg-primary rounded-lg w-32" />
                    <div className="h-10 bg-muted rounded-lg w-32" />
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
