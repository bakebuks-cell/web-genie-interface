import { useState, useRef } from "react";
import { Plus, Mic, Zap, ChevronDown, Check, MicOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const selectedLang = languages.find((l) => l.id === selectedLanguage);
  const isGenerateEnabled = selectedLanguage && idea.trim().length > 0;

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(f => f.name).join(", ");
      toast({
        title: "Files Attached",
        description: `Selected: ${fileNames}`,
      });
      // API integration will be added here to upload files
      console.log("Files selected:", files);
    }
    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  const handleVoice = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Voice input cancelled",
      });
      return;
    }

    setIsRecording(true);
    toast({
      title: "Listening...",
      description: "Speak now to describe your application",
    });

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onIdeaChange(idea ? `${idea} ${transcript}` : transcript);
      toast({
        title: "Voice Captured",
        description: "Your speech has been added to the input",
      });
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      toast({
        title: "Voice Error",
        description: "Couldn't capture your voice. Please try again.",
        variant: "destructive",
      });
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main unified container */}
      <div
        className={`
          relative flex items-start gap-2 p-3 
          bg-card/80 backdrop-blur-xl 
          border-2 rounded-2xl
          transition-all duration-300 ease-out
          shadow-medium min-h-[100px]
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Idea Input - Center */}
        <textarea
          value={idea}
          onChange={(e) => onIdeaChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your application idea..."
          rows={3}
          className="
            flex-1 min-w-0 px-3 py-4 
            bg-transparent text-foreground 
            placeholder:text-muted-foreground 
            focus:outline-none
            text-base resize-none
            scrollbar-hide
          "
        />

        {/* Action Icons - Right */}
        <div className="flex items-center gap-1 pr-1 self-end pb-2">
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
            className={`
              p-2.5 rounded-xl 
              transition-all duration-200
              ${isRecording 
                ? "bg-red-500/20 text-red-500 animate-pulse" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }
            `}
            title={isRecording ? "Stop recording" : "Voice input"}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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
