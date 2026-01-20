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

  // Get user initial from profile or email
  const userInitial = profile?.display_name?.charAt(0) || user?.email?.charAt(0) || "U";

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      {/* Top Toolbar */}
      <GenerateToolbar userInitial={userInitial} currentPath="/" />

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-[400px] flex-shrink-0 border-r border-border">
          <ChatPanel selectedStack={language} />
        </div>
        
        {/* Right Panel - Preview */}
        <div className="flex-1 bg-muted/20">
          <PreviewPanel language={languageDisplay} idea={idea} />
        </div>
      </div>
    </div>
  );
};

export default GenerationPage;
