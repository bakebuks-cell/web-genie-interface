import { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Zap, ChevronDown, Check } from "lucide-react";
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
  { id: "nodejs", name: "Node/TS", icon: "🟢" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "golang", name: "Golang", icon: "🐹" },
  { id: "react", name: "React", icon: "⚛️" },
  { id: "java", name: "Java (Enterprise)", icon: "☕" },
  { id: "csharp", name: "ASP.NET (C#)", icon: "🔷" },
  { id: "html", name: "HTML", icon: "📄" },
  { id: "css", name: "CSS", icon: "🎨" },
  { id: "javascript", name: "JavaScript", icon: "🟨" },
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
  const [displayText, setDisplayText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for speech state
  const isRecordingRef = useRef(false);
  const startIdeaRef = useRef("");
  const accumulatedFinalRef = useRef(""); // Only exact finalized words
  const currentInterimRef = useRef(""); // Temporary preview only
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

  // Reset silence timer - called on every speech activity
  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    
    // Auto-finalize after 5 seconds of continuous silence
    silenceTimeoutRef.current = setTimeout(() => {
      if (isRecordingRef.current) {
        finishRecording();
      }
    }, 5000);
  };

  // Update display: shows finalized + interim preview
  const updateDisplayText = () => {
    const base = startIdeaRef.current.trim();
    const final = accumulatedFinalRef.current.trim();
    const interim = currentInterimRef.current.trim();
    
    // Build display: base + finalized + interim preview
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
    
    // Stop recognition to trigger final results
    if (recognitionRef.current) {
      try { 
        recognitionRef.current.stop();
      } catch {}
    }
    
    // Wait for speech engine to complete final analysis
    finalizeTimeoutRef.current = setTimeout(() => {
      // Commit ONLY the exact finalized words - no interim, no guessing
      const base = startIdeaRef.current.trim();
      const final = accumulatedFinalRef.current.trim();
      
      // Build final text from exact spoken words only
      const parts: string[] = [];
      if (base) parts.push(base);
      if (final) parts.push(final);
      const finalText = parts.join(" ");
      
      // Update state with exact transcription
      onIdeaChange(finalText);
      setDisplayText(finalText);
      
      // Cleanup
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }
      
      setIsRecording(false);
      accumulatedFinalRef.current = "";
      currentInterimRef.current = "";
    }, 500); // Allow engine to finalize analysis
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

    // Toggle off if already recording
    if (isRecordingRef.current) {
      finishRecording();
      return;
    }

    // Initialize recording state
    startIdeaRef.current = idea;
    accumulatedFinalRef.current = "";
    currentInterimRef.current = "";
    lastSpeechTimeRef.current = Date.now();
    isRecordingRef.current = true;

    setIsRecording(true);
    setDisplayText(idea);

    // Start 5-second silence timer
    resetSilenceTimer();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    // STRICT ACCURACY CONFIGURATION
    recognition.lang = "en-US";
    recognition.interimResults = true; // Preview only
    recognition.continuous = true;
    recognition.maxAlternatives = 1; // Use highest confidence result

    recognition.onresult = (event: any) => {
      if (!isRecordingRef.current) return;
      
      // Reset silence timer on any speech activity
      lastSpeechTimeRef.current = Date.now();
      resetSilenceTimer();
      
      // Process results with strict accuracy
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        
        if (result.isFinal) {
          // FINAL: Exact analyzed transcription from speech engine
          // This is the accurate, analyzed result - use as-is
          const exactTranscript = result[0].transcript;
          accumulatedFinalRef.current += exactTranscript;
          currentInterimRef.current = ""; // Clear interim
        } else {
          // INTERIM: Temporary preview - never committed
          // Shows user something is happening but doesn't affect final text
          currentInterimRef.current = result[0].transcript;
        }
      }
      
      updateDisplayText();
    };

    recognition.onspeechstart = () => {
      lastSpeechTimeRef.current = Date.now();
      resetSilenceTimer();
    };

    recognition.onspeechend = () => {
      // Speech ended - silence timer will handle finalization
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return; // Normal, continue
      }
      
      toast({
        title: "Voice Error",
        description: `Error: ${event.error}`,
        variant: "destructive",
      });
      
      isRecordingRef.current = false;
      setIsRecording(false);
      clearTimers();
    };

    recognition.onend = () => {
      // Restart if still recording (browser may stop after ~60s)
      if (isRecordingRef.current && recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch {
          finishRecording();
        }
      }
    };

    try {
      recognition.start();
    } catch (e) {
      isRecordingRef.current = false;
      setIsRecording(false);
      clearTimers();
      toast({
        title: "Voice Error",
        description: "Failed to start voice recognition.",
        variant: "destructive",
      });
    }
  };

  // Sync displayText with idea when not recording
  useEffect(() => {
    if (!isRecording) {
      setDisplayText(idea);
    }
  }, [idea, isRecording]);

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

        {/* Textarea - Shows real-time speech or editable text */}
        <textarea
          value={displayText}
          onChange={(e) => {
            // Only allow manual editing when not recording
            if (!isRecording) {
              onIdeaChange(e.target.value);
            }
          }}
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

        {/* Voice transcript is now shown inline via the textarea value - no overlay needed */}

        {/* Bottom bar - Language left, Icons right */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
          {/* Language Dropdown - Bottom Left (subtle & compact) */}
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

            {/* Voice Button - Closed default, Open with floating animation when active */}
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
              
              {/* Subtle glow ring when recording - theme colors only */}
              {isRecording && (
                <span 
                  className="
                    absolute inset-0 rounded-xl 
                    border-2 border-primary/50
                    animate-[pulse_2s_ease-in-out_infinite]
                    pointer-events-none
                  " 
                />
              )}
            </div>

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
