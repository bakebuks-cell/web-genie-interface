import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import IdeaInput from "./IdeaInput";
import TemplateCards from "./TemplateCards";
import { useToast } from "@/hooks/use-toast";
import { VideoText } from "./magicui/video-text";

export const HeroSection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    toast({
      title: "Technology Selected",
      description: `You selected ${language}`,
    });
  };

  const handleGenerate = () => {
    if (!selectedLanguage) {
      toast({
        title: "Select a Technology",
        description: "Please select a technology first",
        variant: "destructive",
      });
      return;
    }
    
    if (!idea.trim()) {
      toast({
        title: "Describe Your Application",
        description: "Please describe the application you want to build",
        variant: "destructive",
      });
      return;
    }

    // API integration point
    // Navigate to generation page with state
    navigate("/generate", { state: { language: selectedLanguage, idea } });
  };

  const handleTemplateSelect = (template: string, language?: string) => {
    setIdea(template);
    if (language) {
      setSelectedLanguage(language);
    }
    toast({
      title: "Template Selected",
      description: "Template applied to your idea",
    });
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Video Text Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="h-32 md:h-48 lg:h-56 w-full max-w-4xl mx-auto">
            <VideoText
              src="https://cdn.pixabay.com/video/2020/08/12/46964-449623750_large.mp4"
              className="h-full w-full"
              fontSize={12}
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              DATABUKS
            </VideoText>
          </div>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground font-light max-w-xl mx-auto">
            From ideas to production-ready applications.
          </p>
        </div>

        {/* Step 1: Language Selection */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <LanguageSelector 
            selectedLanguage={selectedLanguage} 
            onSelect={handleLanguageSelect} 
          />
        </div>

        {/* Step 2: Idea Input */}
        <div className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <IdeaInput
            value={idea}
            onChange={setIdea}
            onGenerate={handleGenerate}
            disabled={!selectedLanguage}
          />
        </div>

        {/* Templates Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <TemplateCards onSelectTemplate={handleTemplateSelect} />
        </div>
      </div>
    </section>
  );
};
