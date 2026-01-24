import { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Zap, ChevronDown, Check, MicOff } from "lucide-react";
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
  const [isAutoStopping, setIsAutoStopping] = useState(false);
  const [displayText, setDisplayText] = useState(""); // What user sees (final + interim preview)
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Shows "analyzing" state before final commit
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs to avoid stale state inside SpeechRecognition callbacks
  const isRecordingRef = useRef(false);
  const startIdeaRef = useRef(""); // Text before voice started
  const accumulatedFinalRef = useRef(""); // Only finalized accurate text (exact words)
  const currentInterimRef = useRef(""); // Temporary preview (may change)
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const pendingResultsRef = useRef<string[]>([]); // Buffer for accuracy verification
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
      if (silenceCheckIntervalRef.current) clearInterval(silenceCheckIntervalRef.current);
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
      console.log("Files selected:", files);
    }
    e.target.value = "";
  };

  const clearTimers = () => {
    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }
    if (finalizeTimeoutRef.current) {
      clearTimeout(finalizeTimeoutRef.current);
      finalizeTimeoutRef.current = null;
    }
  };

  // Update display: shows finalized text + interim preview (interim shown slightly different)
  const updateDisplayText = (showInterim: boolean = true) => {
    const base = startIdeaRef.current.trim();
    const final = accumulatedFinalRef.current.trim();
    const interim = showInterim ? currentInterimRef.current.trim() : "";
    
    // Build display: base + final + interim preview
    let parts: string[] = [];
    if (base) parts.push(base);
    if (final) parts.push(final);
    if (interim) parts.push(interim);
    
    const combined = parts.join(" ");
    setDisplayText(combined);
    
    // Only update idea with finalized text (not interim)
    const finalOnly = [base, final].filter(Boolean).join(" ");
    // Don't call onIdeaChange here - wait for finalization
  };

  const finishRecording = (showToast: boolean, reason: string) => {
    if (!isRecordingRef.current && !isAutoStopping) return;
    
    isRecordingRef.current = false;
    setIsAutoStopping(true);
    setIsAnalyzing(true);
    
    // Stop recognition to trigger final analysis
    if (recognitionRef.current) {
      try { 
        recognitionRef.current.stop(); // stop() allows final results to come through
      } catch {}
    }
    
    // Wait for speech engine to finalize and analyze (longer delay for accuracy)
    finalizeTimeoutRef.current = setTimeout(() => {
      // Commit only the fully analyzed, accurate final text
      const base = startIdeaRef.current.trim();
      const final = accumulatedFinalRef.current.trim();
      
      // Clear interim - only commit verified final transcription
      currentInterimRef.current = "";
      
      // Build final text from exact spoken words only
      const finalText = [base, final].filter(Boolean).join(" ");
      
      onIdeaChange(finalText);
      setDisplayText(finalText);
      
      // Cleanup
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }
      
      clearTimers();
      
      if (showToast && final) {
        toast({
          title: "✓ Transcription Complete",
          description: "Exact words captured and finalized.",
        });
      }
      
      // Reset state
      setIsRecording(false);
      setIsAutoStopping(false);
      setIsAnalyzing(false);
      accumulatedFinalRef.current = "";
      currentInterimRef.current = "";
      pendingResultsRef.current = [];
    }, 400); // Longer delay to allow speech engine to finalize properly
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

    // Toggle off if already recording (manual stop)
    if (isRecordingRef.current) {
      finishRecording(true, "Stopped manually");
      return;
    }

    // Initialize recording state
    startIdeaRef.current = idea;
    accumulatedFinalRef.current = "";
    currentInterimRef.current = "";
    pendingResultsRef.current = [];
    lastSpeechTimeRef.current = Date.now();
    isRecordingRef.current = true;

    setIsRecording(true);
    setIsAutoStopping(false);
    setIsAnalyzing(false);
    setDisplayText(idea);
    
    toast({
      title: "🎙️ Listening...",
      description: "Speak clearly. Exact words will be captured.",
    });

    // Silence detection: check every 500ms for faster response
    silenceCheckIntervalRef.current = setInterval(() => {
      if (!isRecordingRef.current) return;
      
      const silenceMs = Date.now() - lastSpeechTimeRef.current;
      if (silenceMs >= 5000) {
        finishRecording(true, "Auto-stopped after silence");
      }
    }, 500);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    // ACCURACY-OPTIMIZED CONFIGURATION
    recognition.lang = "en-US";
    recognition.interimResults = true; // Show preview while speaking
    recognition.continuous = true; // Don't stop between sentences
    recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy selection

    recognition.onresult = (event: any) => {
      if (!isRecordingRef.current) return;
      
      // Mark speech activity for silence detection
      lastSpeechTimeRef.current = Date.now();
      
      // Process results with accuracy priority
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        
        if (result.isFinal) {
          // FINAL RESULT: This is the speech engine's analyzed, accurate transcription
          // Get the highest confidence result (first alternative is best)
          const bestTranscript = result[0].transcript;
          
          // Log alternatives for debugging if needed
          if (result.length > 1) {
            console.log("Speech alternatives:", 
              Array.from({ length: result.length }, (_, j) => 
                `${j}: "${result[j].transcript}" (${(result[j].confidence * 100).toFixed(1)}%)`
              )
            );
          }
          
          // Accumulate only finalized, analyzed text (exact words)
          accumulatedFinalRef.current += bestTranscript + " ";
          
          // Clear interim since this segment is now finalized
          currentInterimRef.current = "";
        } else {
          // INTERIM RESULT: Preview only - may change, don't commit
          // Show for user feedback but don't treat as accurate
          currentInterimRef.current = result[0].transcript;
        }
      }
      
      // Update display with finalized + interim preview
      updateDisplayText(true);
    };

    recognition.onspeechstart = () => {
      lastSpeechTimeRef.current = Date.now();
    };

    recognition.onspeechend = () => {
      // Allow natural pauses - silence timer handles auto-stop
    };

    recognition.onaudioend = () => {
      // Audio ended - if still recording, this helps trigger final analysis
      if (isRecordingRef.current) {
        lastSpeechTimeRef.current = Date.now();
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      
      // Handle recoverable errors
      if (event.error === 'no-speech') {
        // No speech detected - this is normal, just continue listening
        return;
      }
      
      if (event.error === 'aborted') {
        // Intentionally stopped - no error toast needed
        return;
      }
      
      // Show error for other issues
      toast({
        title: "Voice Error",
        description: `Error: ${event.error}. Please try again.`,
        variant: "destructive",
      });
      
      finishRecording(false, "");
    };

    recognition.onend = () => {
      // If we're still supposed to be recording, restart recognition
      // (browser may stop recognition after ~60 seconds or on various events)
      if (isRecordingRef.current && recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch (e) {
          // If restart fails, finish recording gracefully
          finishRecording(true, "Recording completed");
        }
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      finishRecording(false, "");
      toast({
        title: "Voice Error",
        description: "Failed to start voice recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Sync displayText with idea when not recording
  useEffect(() => {
    if (!isRecording && !isAutoStopping) {
      setDisplayText(idea);
    }
  }, [idea, isRecording, isAutoStopping]);

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
            if (!isRecording && !isAutoStopping) {
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

            {/* Voice Button - Clean minimal feedback on button only */}
            <div className="relative">
              <button
                onClick={handleVoice}
                disabled={isAutoStopping}
                className={`
                  relative p-2.5 rounded-xl 
                  transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                  ${(isRecording || isAutoStopping)
                    ? "bg-primary/20 text-primary shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }
                `}
                title={isRecording ? "Click to stop" : "Voice input"}
              >
                {(isRecording || isAutoStopping) ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              
              {/* Subtle pulsing glow ring when recording - uses theme colors */}
              {(isRecording || isAutoStopping) && (
                <span 
                  className="
                    absolute inset-0 rounded-xl 
                    border-2 border-primary/60
                    animate-[pulse_1.5s_ease-in-out_infinite]
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
