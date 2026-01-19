import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UnifiedInput from "./UnifiedInput";
import TemplateCards from "./TemplateCards";
import { useToast } from "@/hooks/use-toast";

// Language mapping for display names
const languageNames: Record<string, string> = {
  "php": "PHP",
  "java-spring": "Java Spring Boot",
  "python-django": "Python Django",
  "aspnet": "ASP.NET",
  "nodejs-react": "Node.js + React",
};

export const HeroSection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    toast({
      title: "Language Selected",
      description: `You selected ${languageNames[language] || language}`,
    });
  };

  const handleGenerate = () => {
    if (!selectedLanguage) {
      toast({
        title: "Select a Language",
        description: "Please select a programming language first",
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

  const handleTemplateSelect = (template: { description: string; language?: string }) => {
    setIdea(template.description);
    if (template.language) {
      setSelectedLanguage(template.language);
    }
    toast({
      title: "Template Selected",
      description: "Template applied to your idea",
    });
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quote */}
        <div className="text-center mb-12 animate-fade-in">
          <p className="text-xl md:text-2xl text-muted-foreground font-light italic max-w-xl mx-auto">
            "Build powerful web applications from simple ideas."
          </p>
        </div>

        {/* Unified Input Container */}
        <div className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <UnifiedInput
            selectedLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
            idea={idea}
            onIdeaChange={setIdea}
            onGenerate={handleGenerate}
          />
        </div>

        {/* Templates Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <TemplateCards onSelectTemplate={handleTemplateSelect} />
        </div>
      </div>
    </section>
  );
};
