import { useState } from "react";
import { Plus, Mic, Zap, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UnifiedInputProps {
  selectedLanguage: string | null;
  onLanguageSelect: (language: string) => void;
  idea: string;
  onIdeaChange: (value: string) => void;
  onGenerate: () => void;
}

const languages = [
  { id: "php", name: "PHP", icon: "🐘" },
  { id: "java-spring", name: "Java Spring Boot", icon: "☕" },
  { id: "python-django", name: "Python Django", icon: "🐍" },
  { id: "aspnet", name: "ASP.NET", icon: "🔷" },
  { id: "nodejs-react", name: "Node.js + React", icon: "⚛️" },
];

const UnifiedInput = ({
  selectedLanguage,
  onLanguageSelect,
  idea,
  onIdeaChange,
  onGenerate,
}: UnifiedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const selectedLang = languages.find((l) => l.id === selectedLanguage);
  const isGenerateEnabled = selectedLanguage && idea.trim().length > 0;

  const handleAttach = () => {
    // API integration will be added here
    console.log("Attach file clicked");
  };

  const handleVoice = () => {
    // API integration will be added here
    console.log("Voice input clicked");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main unified container */}
      <div
        className={`
          relative flex items-center gap-2 p-2 
          bg-card/80 backdrop-blur-xl 
          border-2 rounded-2xl
          transition-all duration-300 ease-out
          shadow-medium
          ${isFocused 
            ? "border-primary shadow-glow" 
            : "border-border hover:border-primary/50"
          }
        `}
      >
        {/* Language Dropdown - Left */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`
                flex items-center gap-2 px-4 py-3 
                rounded-xl border transition-all duration-200
                min-w-[160px] justify-between
                ${selectedLanguage 
                  ? "bg-primary/10 border-primary/30 text-foreground" 
                  : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/50"
                }
              `}
            >
              <span className="flex items-center gap-2 text-sm font-medium truncate">
                {selectedLang ? (
                  <>
                    <span>{selectedLang.icon}</span>
                    <span className="hidden sm:inline">{selectedLang.name}</span>
                    <span className="sm:hidden">{selectedLang.name.split(" ")[0]}</span>
                  </>
                ) : (
                  "Select Language"
                )}
              </span>
              <ChevronDown className="w-4 h-4 shrink-0 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="w-56 bg-popover/95 backdrop-blur-xl border-border"
          >
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.id}
                onClick={() => onLanguageSelect(lang.id)}
                className={`
                  flex items-center gap-3 px-3 py-3 cursor-pointer
                  transition-colors duration-150
                  ${selectedLanguage === lang.id 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-accent"
                  }
                `}
              >
                <span className="text-lg">{lang.icon}</span>
                <span className="font-medium">{lang.name}</span>
                {selectedLanguage === lang.id && (
                  <Check className="w-4 h-4 ml-auto text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="w-px h-8 bg-border/50 hidden sm:block" />

        {/* Idea Input - Center */}
        <input
          type="text"
          value={idea}
          onChange={(e) => onIdeaChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your application idea..."
          className="
            flex-1 min-w-0 px-3 py-3 
            bg-transparent text-foreground 
            placeholder:text-muted-foreground 
            focus:outline-none
            text-base
          "
        />

        {/* Action Icons - Right */}
        <div className="flex items-center gap-1 pr-1">
          {/* Attach Button */}
          <button
            onClick={handleAttach}
            className="
              p-2.5 rounded-xl 
              text-muted-foreground hover:text-foreground 
              hover:bg-secondary/80
              transition-all duration-200
            "
            title="Attach file"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Voice Button */}
          <button
            onClick={handleVoice}
            className="
              p-2.5 rounded-xl 
              text-muted-foreground hover:text-foreground 
              hover:bg-secondary/80
              transition-all duration-200
            "
            title="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Generate Button - Primary */}
          <button
            onClick={onGenerate}
            disabled={!isGenerateEnabled}
            className={`
              p-3 rounded-xl transition-all duration-300
              ${isGenerateEnabled
                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/30 animate-pulse-glow"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              }
            `}
            title={isGenerateEnabled ? "Generate Application" : "Select language and describe your idea first"}
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Helper text */}
      {!selectedLanguage && (
        <p className="text-center text-muted-foreground text-sm mt-4 animate-fade-in">
          Select a language to get started
        </p>
      )}
      {selectedLanguage && !idea.trim() && (
        <p className="text-center text-muted-foreground text-sm mt-4 animate-fade-in">
          Describe your application idea
        </p>
      )}
    </div>
  );
};

export default UnifiedInput;
