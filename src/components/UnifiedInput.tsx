import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Mic, Sparkles, ChevronDown, Check, X, Zap, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MultiProgramModal from "./MultiProgramModal";

interface UnifiedInputProps {
  selectedLanguage: string | null;
  onLanguageSelect: (language: string) => void;
  idea: string;
  onIdeaChange: (idea: string) => void;
  onGenerate: () => void;
}

const languages = [
  { id: "html", name: "Plain HTML/CSS/JS", icon: "🌐" },
  { id: "php", name: "PHP", icon: "🐘" },
  { id: "nodejs", name: "Node/TS", icon: "🟢" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "golang", name: "Golang", icon: "🐹" },
  { id: "react", name: "React", icon: "⚛️" },
  { id: "java", name: "Java (Enterprise)", icon: "☕" },
  { id: "csharp", name: "ASP.NET (C#)", icon: "🔷" },
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
  const [multiProgramOpen, setMultiProgramOpen] = useState(false);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [displayText, setDisplayText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for speech state
  const isRecordingRef = useRef(false);
  const startIdeaRef = useRef("");
  const accumulatedFinalRef = useRef("");
  const currentInterimRef = useRef("");
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const { toast } = useToast();
  
  const selectedLang = languages.find((l) => l.id === selectedLanguage);
  const isGenerateEnabled = selectedLanguage && idea.trim().length > 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (finalizeTimeoutRef.current) clearTimeout(finalizeTimeoutRef.current);
    };
  }, []);

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
    }
    e.target.value = "";
  };

  const clearTimers = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (finalizeTimeoutRef.current) {
      clearTimeout(finalizeTimeoutRef.current);
      finalizeTimeoutRef.current = null;
    }
  };

  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      if (isRecordingRef.current) {
        finishRecording();
      }
    }, 5000);
  };

  const updateDisplayText = () => {
    const base = startIdeaRef.current.trim();
    const final = accumulatedFinalRef.current.trim();
    const interim = currentInterimRef.current.trim();
    const parts: string[] = [];
    if (base) parts.push(base);
    if (final) parts.push(final);
    if (interim) parts.push(interim);
    setDisplayText(parts.join(" "));
  };

  const finishRecording = () => {
    if (!isRecordingRef.current) return;
    isRecordingRef.current = false;
    clearTimers();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    finalizeTimeoutRef.current = setTimeout(() => {
      const base = startIdeaRef.current.trim();
      const final = accumulatedFinalRef.current.trim();
      const parts: string[] = [];
      if (base) parts.push(base);
      if (final) parts.push(final);
      const finalText = parts.join(" ");
      onIdeaChange(finalText);
      setDisplayText(finalText);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }
      setIsRecording(false);
      accumulatedFinalRef.current = "";
      currentInterimRef.current = "";
    }, 500);
  };

  const handleVoice = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({ title: "Voice Not Supported", description: "Your browser doesn't support voice input. Try Chrome or Edge.", variant: "destructive" });
      return;
    }
    if (isRecordingRef.current) { finishRecording(); return; }

    startIdeaRef.current = idea;
    accumulatedFinalRef.current = "";
    currentInterimRef.current = "";
    lastSpeechTimeRef.current = Date.now();
    isRecordingRef.current = true;
    setIsRecording(true);
    setDisplayText(idea);
    resetSilenceTimer();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      if (!isRecordingRef.current) return;
      lastSpeechTimeRef.current = Date.now();
      resetSilenceTimer();
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          accumulatedFinalRef.current += result[0].transcript;
          currentInterimRef.current = "";
        } else {
          currentInterimRef.current = result[0].transcript;
        }
      }
      updateDisplayText();
    };

    recognition.onspeechstart = () => { lastSpeechTimeRef.current = Date.now(); resetSilenceTimer(); };
    recognition.onspeechend = () => {};
    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      toast({ title: "Voice Error", description: `Error: ${event.error}`, variant: "destructive" });
      isRecordingRef.current = false;
      setIsRecording(false);
      clearTimers();
    };
    recognition.onend = () => {
      if (isRecordingRef.current && recognitionRef.current === recognition) {
        try { recognition.start(); } catch { finishRecording(); }
      }
    };

    try { recognition.start(); } catch (e) {
      isRecordingRef.current = false;
      setIsRecording(false);
      clearTimers();
      toast({ title: "Voice Error", description: "Failed to start voice recognition.", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (!isRecording) { setDisplayText(idea); }
  }, [idea, isRecording]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main unified container - futuristic teal glow */}
      <div
        className={`
          relative flex flex-col p-4
          rounded-2xl
          backdrop-blur-lg
          transition-all duration-300 ease-out
          ${isFocused 
            ? "shadow-[0_0_50px_rgba(0,255,200,0.35),0_0_80px_rgba(0,255,200,0.15),inset_0_0_30px_rgba(0,255,200,0.05)]" 
            : "shadow-[0_0_40px_rgba(0,255,200,0.2),0_0_60px_rgba(0,255,200,0.08)]"
          }
        `}
        style={{
          background: "rgba(30, 30, 30, 0.6)",
          border: "1px solid rgba(0, 230, 210, 0.25)",
        }}
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

        {/* Textarea */}
        <textarea
          value={displayText}
          onChange={(e) => { if (!isRecording) { onIdeaChange(e.target.value); } }}
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

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`
                  flex items-center gap-2 px-3 py-2
                  rounded-lg border transition-all duration-200
                  text-sm
                  ${selectedLanguage 
                    ? "bg-primary/10 border-primary/30 text-foreground" 
                    : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/40 hover:bg-secondary/50"
                  }
                `}
              >
                <span className="flex items-center gap-2 font-medium">
                  {selectedLang ? (
                    <>
                      <span className="text-base">{selectedLang.icon}</span>
                      <span>{selectedLang.name}</span>
                    </>
                  ) : (
                    "Select Language"
                  )}
                </span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-56 bg-popover/95 backdrop-blur-xl border-border z-50"
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
                      : "hover:bg-accent/10"
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

          {/* Multi-Program Button */}
          <button
            onClick={() => setMultiProgramOpen(true)}
            className={`
              flex items-center gap-2 px-3 py-2
              rounded-lg border transition-all duration-200 text-sm
              ${selectedStacks.length > 0
                ? "bg-primary/10 border-primary/30 text-foreground"
                : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/40 hover:bg-secondary/50"
              }
            `}
          >
            <Layers className="w-4 h-4" />
            <span className="font-medium">
              {selectedStacks.length > 0
                ? `Multi-Program (${selectedStacks.length} selected)`
                : "Multi-Program"
              }
            </span>
          </button>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAttach}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 active:scale-95 transition-all duration-200"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={handleVoice}
                className={`
                  relative p-2.5 rounded-xl 
                  transition-all duration-300 active:scale-95
                  ${isRecording
                    ? "bg-primary/20 text-primary animate-[float_2s_ease-in-out_infinite]"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }
                `}
                title={isRecording ? "Click to stop" : "Voice input"}
              >
                <Mic className="w-5 h-5" />
              </button>
              {isRecording && (
                <span className="absolute inset-0 rounded-xl border-2 border-primary/50 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none" />
              )}
            </div>

            {/* Generate Button - teal neon gradient */}
            <button
              onClick={onGenerate}
              disabled={!isGenerateEnabled}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl 
                font-medium text-sm
                transition-all duration-300 active:scale-95
                ${isGenerateEnabled
                  ? "text-primary-foreground hover:opacity-90 shadow-[0_0_20px_rgba(0,255,200,0.3)]"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }
              `}
              style={isGenerateEnabled ? {
                background: "linear-gradient(90deg, #00f0ff, #00c8a0)",
              } : undefined}
              title={isGenerateEnabled ? "Generate Application" : "Select language and describe your idea first"}
            >
              <Zap className="w-4 h-4" />
              <span>Generate</span>
            </button>
    </div>

    {/* Multi-Program Modal */}
    <MultiProgramModal
      open={multiProgramOpen}
      onClose={() => setMultiProgramOpen(false)}
      selectedStacks={selectedStacks}
      onApply={setSelectedStacks}
    />
  </div>
      </div>
    </div>
  );
};

export default UnifiedInput;
