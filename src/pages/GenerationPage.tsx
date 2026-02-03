import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatPanel, { HealthCheckStatus } from "@/components/ChatPanel";
import GenerateToolbar from "@/components/GenerateToolbar";
import { GenerationDashboard } from "@/components/generation";
import { useAuth } from "@/contexts/AuthContext";

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
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { language, idea } = location.state || { language: "react", idea: "" };
  const languageDisplay = languageNames[language] || language;

  // State for toolbar controls
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedDevice, setSelectedDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // State for generated URL from backend
  const [generatedUrl, setGeneratedUrl] = useState<string | undefined>(undefined);
  
  // State for health check status
  const [healthCheckStatus, setHealthCheckStatus] = useState<HealthCheckStatus | undefined>(undefined);
  
  // State for Visual Edit Mode
  const [visualEditMode, setVisualEditMode] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // State for project ID (received from initial build)
  const [projectId, setProjectId] = useState<string | null>(null);
  
  // State for generation status
  const [isGenerating, setIsGenerating] = useState(true);

  // Get user initial from profile or email
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
    setGeneratedUrl(url);
    setIsGenerating(false);
    if (newProjectId) {
      setProjectId(newProjectId);
    }
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

  const handleCancelGeneration = () => {
    setIsGenerating(false);
  };

  const handleGenerateAnother = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <GenerateToolbar 
        userInitial={userInitial} 
        currentPath={currentPath}
        onPathChange={setCurrentPath}
        onDeviceChange={setSelectedDevice}
        selectedDevice={selectedDevice}
        onRefresh={handleRefresh}
        onOpenExternal={handleOpenExternal}
      />

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-[400px] flex-shrink-0 border-r border-border">
          <ChatPanel 
            selectedStack={language} 
            initialPrompt={idea}
            onGeneratedUrl={handleGeneratedUrl}
            onHealthCheckStatus={handleHealthCheckStatus}
            projectId={projectId}
            selectedElementId={selectedElementId}
            onClearElement={clearSelectedElement}
          />
        </div>
        
        {/* Right Panel - Futuristic AI Dashboard */}
        <div className="flex-1">
          <GenerationDashboard
            idea={idea}
            isGenerating={isGenerating}
            generatedUrl={generatedUrl}
            onCancel={handleCancelGeneration}
            onGenerateAnother={handleGenerateAnother}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerationPage;
