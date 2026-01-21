import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface PreviewPanelProps {
  language: string;
  idea: string;
  currentRoute?: string;
  viewMode?: "desktop" | "tablet" | "mobile";
  generatedUrl?: string;
}

// Mock content for different routes
const ROUTE_CONTENT: Record<string, { title: string; description: string }> = {
  "/": { title: "Welcome to Your App", description: "Home page content" },
  "/login": { title: "Login", description: "Sign in to your account" },
  "/dashboard": { title: "Dashboard", description: "Your personal dashboard" },
  "/settings": { title: "Settings", description: "Configure your preferences" },
  "/profile": { title: "Profile", description: "Manage your profile" },
};

const PreviewPanel = ({ 
  language, 
  idea, 
  currentRoute = "/",
  viewMode = "desktop",
  generatedUrl
}: PreviewPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If we have a generated URL, skip the loading animation
    if (generatedUrl) {
      setIsLoading(false);
      setProgress(100);
      return;
    }

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
  }, [generatedUrl]);

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

  const routeContent = ROUTE_CONTENT[currentRoute] || ROUTE_CONTENT["/"];

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Prominent OPEN APP Button - Shown when URL is available */}
      {generatedUrl && (
        <div className="px-4 py-4 bg-gradient-to-r from-primary/20 to-primary/10 border-b-2 border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              ✅ Generated app is ready!
            </span>
          </div>
          <a
            href={generatedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ExternalLink className="w-5 h-5" />
            OPEN APP
          </a>
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            ⚠️ If preview below is blocked, click "OPEN APP" to view in new tab
          </p>
        </div>
      )}

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
                    className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300"
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
          ) : generatedUrl ? (
            // Display iframe with generated URL
            <div className="h-full bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
              {/* Browser Chrome */}
              <div className="h-12 bg-muted/50 border-b border-border flex items-center px-4 gap-2 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-background border border-border rounded-lg flex items-center px-3 max-w-md">
                    <span className="text-xs text-muted-foreground font-mono truncate">
                      {generatedUrl}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Iframe */}
              <div className="flex-1 relative">
                <iframe
                  src={generatedUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  title="Generated Application Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
              </div>
            </div>
          ) : (
            <div className="h-full bg-card rounded-2xl border border-border overflow-hidden">
              {/* Browser Chrome */}
              <div className="h-12 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-background border border-border rounded-lg flex items-center px-3 max-w-sm">
                    <span className="text-xs text-muted-foreground font-mono">
                      localhost:3000{currentRoute}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Route-specific content */}
              <div className="p-6">
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-foreground">{routeContent.title}</h1>
                  <p className="text-muted-foreground">{routeContent.description}</p>
                  
                  {currentRoute === "/" && (
                    <>
                      <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="h-24 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="text-primary text-sm font-medium">Feature 1</span>
                        </div>
                        <div className="h-24 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="text-primary text-sm font-medium">Feature 2</span>
                        </div>
                        <div className="h-24 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="text-primary text-sm font-medium">Feature 3</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-8">
                        <div className="h-10 bg-primary rounded-lg px-6 flex items-center justify-center">
                          <span className="text-primary-foreground text-sm font-medium">Get Started</span>
                        </div>
                        <div className="h-10 bg-muted rounded-lg px-6 flex items-center justify-center">
                          <span className="text-foreground text-sm font-medium">Learn More</span>
                        </div>
                      </div>
                    </>
                  )}

                  {currentRoute === "/login" && (
                    <div className="max-w-sm mt-8 space-y-4">
                      <div className="h-10 bg-muted rounded-lg" />
                      <div className="h-10 bg-muted rounded-lg" />
                      <div className="h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-medium">Sign In</span>
                      </div>
                    </div>
                  )}

                  {currentRoute === "/dashboard" && (
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="h-32 bg-muted rounded-xl p-4">
                        <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2" />
                        <div className="h-8 bg-primary/20 rounded w-3/4" />
                      </div>
                      <div className="h-32 bg-muted rounded-xl p-4">
                        <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2" />
                        <div className="h-8 bg-primary/20 rounded w-3/4" />
                      </div>
                      <div className="h-32 bg-muted rounded-xl p-4">
                        <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2" />
                        <div className="h-8 bg-primary/20 rounded w-3/4" />
                      </div>
                      <div className="h-32 bg-muted rounded-xl p-4">
                        <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2" />
                        <div className="h-8 bg-primary/20 rounded w-3/4" />
                      </div>
                    </div>
                  )}

                  {currentRoute === "/settings" && (
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="text-sm text-foreground">Notifications</span>
                        <div className="w-10 h-6 bg-primary rounded-full" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="text-sm text-foreground">Dark Mode</span>
                        <div className="w-10 h-6 bg-muted-foreground/30 rounded-full" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="text-sm text-foreground">Auto-save</span>
                        <div className="w-10 h-6 bg-primary rounded-full" />
                      </div>
                    </div>
                  )}

                  {currentRoute === "/profile" && (
                    <div className="mt-8 flex items-start gap-6">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-primary font-bold">U</span>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="h-6 bg-muted rounded w-1/3" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-10 bg-primary rounded-lg w-32 flex items-center justify-center mt-4">
                          <span className="text-primary-foreground text-sm font-medium">Edit Profile</span>
                        </div>
                      </div>
                    </div>
                  )}
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
