import { useState, useRef } from "react";
import { Paperclip, Mic, Zap, ChevronDown, Check, MicOff, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface UnifiedInputProps {
  selectedLanguage: string | null;
  onLanguageSelect: (language: string) => void;
  idea: string;
  onIdeaChange: (value: string) => void;
  onGenerate: () => void;
}

// Updated languages - ONLY these 5 options
const languages = [
  { id: "react", name: "React", icon: "⚛️" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "php", name: "PHP", icon: "🐘" },
  { id: "golang", name: "Golang", icon: "🔵" },
  { id: "node-typescript", name: "Node / TypeScript", icon: "📦" },
];

// Technologies mapped to each language
const technologiesMap: Record<string, { name: string; description: string }[]> = {
  react: [
    { name: "JSX", description: "JavaScript XML syntax" },
    { name: "Hooks", description: "React state management" },
    { name: "Tailwind CSS", description: "Utility-first CSS" },
    { name: "Vite", description: "Next-gen build tool" },
  ],
  "node-typescript": [
    { name: "Express", description: "Minimal web framework" },
    { name: "Fastify", description: "Fast & low overhead" },
  ],
  python: [
    { name: "FastAPI", description: "Modern, fast API framework" },
  ],
  php: [
    { name: "Laravel", description: "PHP web framework" },
  ],
  golang: [
    { name: "Gin", description: "HTTP web framework" },
  ],
};

const UnifiedInput = ({
  selectedLanguage,
  onLanguageSelect,
  idea,
  onIdeaChange,
  onGenerate,
}: UnifiedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const selectedLang = languages.find((l) => l.id === selectedLanguage);
  const isGenerateEnabled = selectedLanguage && idea.trim().length > 0;
  const technologies = selectedLanguage ? technologiesMap[selectedLanguage] || [] : [];

  // Filter languages based on search
  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      console.log("Files selected:", files);
    }
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

  const handleLanguageSelection = (langId: string) => {
    onLanguageSelect(langId);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main unified container - Medium size with constant blue glow */}
      <div
        className="
          relative flex flex-col p-4
          bg-card/80 backdrop-blur-xl 
          border border-primary/40 rounded-xl
          shadow-[0_0_25px_rgba(59,130,246,0.15),0_0_50px_rgba(59,130,246,0.08)]
          transition-all duration-300 ease-out
          hover:shadow-[0_0_30px_rgba(59,130,246,0.2),0_0_60px_rgba(59,130,246,0.12)]
          hover:border-primary/50
        "
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Textarea - Text starts top-left, reduced height */}
        <textarea
          value={idea}
          onChange={(e) => onIdeaChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your application idea..."
          rows={3}
          className="
            w-full px-1 py-1
            bg-transparent text-foreground 
            placeholder:text-muted-foreground/50
            focus:outline-none
            text-sm leading-relaxed resize-none
            scrollbar-hide
          "
        />

        {/* Language Selection Section */}
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Select Language
            </span>
          </div>

          {/* Language Dropdown - Searchable */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`
                  w-full flex items-center justify-between gap-2 px-4 py-3
                  rounded-lg border transition-all duration-200
                  text-sm
                  ${selectedLanguage 
                    ? "bg-primary/10 border-primary/30 text-foreground" 
                    : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/40 hover:bg-secondary/50"
                  }
                `}
              >
                <span className="flex items-center gap-3 font-medium">
                  {selectedLang ? (
                    <>
                      <span className="text-xl">{selectedLang.icon}</span>
                      <span>{selectedLang.name}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl opacity-50">🔧</span>
                      <span>Choose a language...</span>
                    </>
                  )}
                </span>
                <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-[calc(100vw-4rem)] max-w-[calc(32rem-2rem)] bg-popover/95 backdrop-blur-xl border-border z-50"
              sideOffset={8}
            >
              {/* Search Input */}
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search languages..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Language Options */}
              <div className="max-h-64 overflow-y-auto py-1">
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.id}
                      onClick={() => handleLanguageSelection(lang.id)}
                      className={`
                        flex items-center gap-3 px-4 py-3 cursor-pointer
                        transition-colors duration-150
                        ${selectedLanguage === lang.id 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-accent"
                        }
                      `}
                    >
                      <span className="text-xl">{lang.icon}</span>
                      <span className="font-medium flex-1">{lang.name}</span>
                      {selectedLanguage === lang.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No languages found
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Technologies Section - Dynamic based on language */}
        <AnimatePresence mode="wait">
          {selectedLanguage && technologies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-4 pt-4 border-t border-border/30 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Technologies
                </span>
                <span className="text-xs text-primary/70">
                  {technologies.length} available
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div
                      className="
                        px-3 py-2 rounded-lg
                        bg-secondary/50 border border-border/50
                        text-sm font-medium text-foreground
                        hover:bg-primary/10 hover:border-primary/30
                        transition-all duration-200 cursor-default
                      "
                    >
                      {tech.name}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="
                      absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                      px-2 py-1 rounded bg-foreground text-background text-xs
                      opacity-0 group-hover:opacity-100
                      pointer-events-none transition-opacity duration-200
                      whitespace-nowrap z-50
                    ">
                      {tech.description}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom bar - Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
          {/* Status indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {selectedLanguage && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-md text-primary"
              >
                <span>{selectedLang?.icon}</span>
                <span>{selectedLang?.name}</span>
              </motion.span>
            )}
          </div>

          {/* Action Icons - Right side, grouped & center-aligned */}
          <div className="flex items-center gap-2">
            {/* Attach Button */}
            <button
              onClick={handleAttach}
              className="
                p-2.5 rounded-xl 
                text-muted-foreground hover:text-foreground 
                hover:bg-secondary/60 active:scale-95
                transition-all duration-200
              "
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Voice Button */}
            <button
              onClick={handleVoice}
              className={`
                p-2.5 rounded-xl 
                transition-all duration-200 active:scale-95
                ${isRecording 
                  ? "bg-destructive/20 text-destructive animate-pulse" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }
              `}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Generate Button - Primary action */}
            <button
              onClick={onGenerate}
              disabled={!isGenerateEnabled}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl 
                font-medium text-sm
                transition-all duration-300 active:scale-95
                ${isGenerateEnabled
                  ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }
              `}
              title={isGenerateEnabled ? "Generate Application" : "Select language and describe your idea first"}
            >
              <Zap className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UnifiedInput;
