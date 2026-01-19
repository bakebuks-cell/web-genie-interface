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
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center">
            <Database className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-sm">DataBuks Studio</h1>
            <p className="text-xs text-muted-foreground truncate max-w-md">{idea}</p>
          </div>
        </Link>
        
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-accent">
            {languageDisplay}
          </span>
        </div>
      </header>
      
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
