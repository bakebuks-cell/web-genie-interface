import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatPanel from "@/components/ChatPanel";
import type { HealthCheckStatus } from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useGenerationStore } from "@/stores/useGenerationStore";

const languageNames: Record<string, string> = {
  html: "Plain HTML/CSS/JS",
  php: "PHP",
  nodejs: "Node/TS",
  python: "Python",
  golang: "Golang",
  react: "React",
};

const GenerationPage = () => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const genStore = useGenerationStore();

  // Hydrate from persistent store on mount
  useEffect(() => {
    genStore.hydrate();
  }, []);

  // Prefer store values, fall back to route state
  const language = genStore.stack || location.state?.language || "react";
  const idea = genStore.prompt || location.state?.idea || "";
  const languageDisplay = languageNames[language] || language;

  // State for toolbar controls
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedDevice, setSelectedDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // Pre-populate generated URL from store if available
  const [generatedUrl, setGeneratedUrl] = useState<string | undefined>(
    genStore.generatedUrl || undefined
  );
  
  const [healthCheckStatus, setHealthCheckStatus] = useState<HealthCheckStatus | undefined>(
    genStore.status === "ready" 
      ? { isChecking: false, isReady: true, elapsedSeconds: 0 } 
      : genStore.status === "queued" || genStore.status === "building"
        ? { isChecking: true, isReady: false, elapsedSeconds: 0 }
        : undefined
  );
  
  const [visualEditMode, setVisualEditMode] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Pre-populate projectId from store
  const [projectId, setProjectId] = useState<string | null>(
    genStore.backendProjectId || null
  );

  // Sync store changes to local state
  useEffect(() => {
    if (genStore.generatedUrl && genStore.generatedUrl !== generatedUrl) {
      console.log("[GenerationPage] Syncing generatedUrl from store:", genStore.generatedUrl);
      setGeneratedUrl(genStore.generatedUrl);
      setHealthCheckStatus({ isChecking: false, isReady: true, elapsedSeconds: 0 });
    }
    if (genStore.backendProjectId && genStore.backendProjectId !== projectId) {
      setProjectId(genStore.backendProjectId);
    }
  }, [genStore.generatedUrl, genStore.backendProjectId]);

  // Track elapsed seconds during build for preview progress
  useEffect(() => {
    if (!healthCheckStatus?.isChecking) return;
    const interval = setInterval(() => {
      setHealthCheckStatus(prev => prev ? { ...prev, elapsedSeconds: (prev.elapsedSeconds || 0) + 1 } : prev);
    }, 1000);
    return () => clearInterval(interval);
  }, [healthCheckStatus?.isChecking]);

  const userInitial = profile?.display_name?.charAt(0) || user?.email?.charAt(0) || "b";

  const handleRefresh = () => {
    if (generatedUrl) {
      const currentUrl = generatedUrl;
      setGeneratedUrl(undefined);
      setTimeout(() => setGeneratedUrl(currentUrl), 100);
    }
  };

  const handleOpenExternal = () => {
    const urlToOpen = generatedUrl || `https://preview.example.com${currentPath}`;
    window.open(urlToOpen, "_blank");
  };

  const handleGeneratedUrl = (url: string, newProjectId?: string) => {
    console.log("[GenerationPage] Received generatedUrl:", url, "projectId:", newProjectId);
    setGeneratedUrl(url);
    if (newProjectId) {
      setProjectId(newProjectId);
    }
    // Also update the persistent store
    genStore.setResult({
      backendProjectId: newProjectId || "",
      generatedUrl: url,
    });
  };

  const handleHealthCheckStatus = (status: HealthCheckStatus) => {
    setHealthCheckStatus(status);
  };

  const handleElementSelect = (elementId: string | null) => {
    setSelectedElementId(elementId);
  };

  const clearSelectedElement = () => {
    setSelectedElementId(null);
  };

  // Determine if ChatPanel should skip auto-triggering
  // (build already completed during /generating phase)
  const skipAutoTrigger = genStore.status === "ready" && !!genStore.generatedUrl;

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[400px] flex-shrink-0 border-r border-border">
          <ChatPanel 
            selectedStack={language} 
            initialPrompt={skipAutoTrigger ? "" : idea}
            onGeneratedUrl={handleGeneratedUrl}
            onHealthCheckStatus={handleHealthCheckStatus}
            projectId={projectId}
            selectedElementId={selectedElementId}
            onClearElement={clearSelectedElement}
          />
        </div>
        
        <div className="flex-1 bg-muted/20">
          <PreviewPanel 
            language={languageDisplay} 
            idea={idea} 
            currentRoute={currentPath}
            viewMode={selectedDevice}
            generatedUrl={generatedUrl}
            healthCheckStatus={healthCheckStatus}
            onRefresh={handleRefresh}
            visualEditMode={visualEditMode}
            onVisualEditModeChange={setVisualEditMode}
            onElementSelect={handleElementSelect}
            selectedElementId={selectedElementId}
            projectId={projectId}
            prompt={idea}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerationPage;
