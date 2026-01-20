import { useState } from "react";
import { useLocation } from "react-router-dom";
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import GenerateToolbar from "@/components/GenerateToolbar";
import { useAuth } from "@/contexts/AuthContext";

const languageNames: Record<string, string> = {
  php: "PHP",
  java: "Java Spring Boot",
  python: "Python Django",
  dotnet: "ASP.NET",
  "node-react": "Node.js + React",
};

const GenerationPage = () => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const { language, idea } = location.state || { language: "node-react", idea: "Sample application" };
  const languageDisplay = languageNames[language] || language;

  // State for toolbar controls
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedDevice, setSelectedDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // State for generated URL from backend
  const [generatedUrl, setGeneratedUrl] = useState<string | undefined>(undefined);

  // Get user initial from profile or email
  const userInitial = profile?.display_name?.charAt(0) || user?.email?.charAt(0) || "b";

  const handleRefresh = () => {
    // Refresh the iframe by resetting and setting the URL again
    if (generatedUrl) {
      const currentUrl = generatedUrl;
      setGeneratedUrl(undefined);
      setTimeout(() => setGeneratedUrl(currentUrl), 100);
    }
  };

  const handleOpenExternal = () => {
    // Open generated URL or fallback
    const urlToOpen = generatedUrl || `https://preview.example.com${currentPath}`;
    window.open(urlToOpen, "_blank");
  };

  const handleGeneratedUrl = (url: string) => {
    setGeneratedUrl(url);
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
            onGeneratedUrl={handleGeneratedUrl}
          />
        </div>
        
        {/* Right Panel - Preview */}
        <div className="flex-1 bg-muted/20">
          <PreviewPanel 
            language={languageDisplay} 
            idea={idea} 
            currentRoute={currentPath}
            viewMode={selectedDevice}
            generatedUrl={generatedUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerationPage;
