import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";

const languageNames: Record<string, string> = {
  php: "PHP",
  java: "Java Spring Boot",
  python: "Python Django",
  dotnet: "ASP.NET",
  "node-react": "Node.js + React",
};

const GenerationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, idea } = location.state || { language: "node-react", idea: "Sample application" };
  const languageDisplay = languageNames[language] || language;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-96 flex-shrink-0">
          <ChatPanel />
        </div>
        
        {/* Right Panel - Preview */}
        <div className="flex-1">
          <PreviewPanel language={languageDisplay} idea={idea} />
        </div>
      </div>
    </div>
  );
};

export default GenerationPage;
