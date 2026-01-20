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

  // Get user initial from profile or email
  const userInitial = profile?.display_name?.charAt(0) || user?.email?.charAt(0) || "b";

  const handleRefresh = () => {
    // Simulate refresh by briefly resetting
    console.log("Refreshing preview...");
  };

  const handleOpenExternal = () => {
    // Open current route in new tab
    window.open(`https://preview.example.com${currentPath}`, "_blank");
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
          <ChatPanel selectedStack={language} />
        </div>
        
        {/* Right Panel - Preview */}
        <div className="flex-1 bg-muted/20">
          <PreviewPanel 
            language={languageDisplay} 
            idea={idea} 
            currentRoute={currentPath}
            viewMode={selectedDevice}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerationPage;
