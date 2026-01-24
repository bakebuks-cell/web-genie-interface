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
  const [interimTranscript, setInterimTranscript] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs to avoid stale state inside SpeechRecognition callbacks
  const isRecordingRef = useRef(false);
  const startIdeaRef = useRef("");
  const accumulatedFinalRef = useRef(""); // All finalized text segments
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
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
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

  const clearAllTimers = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  };

  const updateIdeaWithTranscript = (finalText: string, interimText: string = "") => {
    const base = startIdeaRef.current.trim();
    const combined = `${finalText} ${interimText}`.trim();
    if (!combined) return;
    
    const newIdea = base ? `${base} ${combined}` : combined;
    onIdeaChange(newIdea);
  };

  const finishRecording = (showToast: boolean, reason: string) => {
    isRecordingRef.current = false;
    
    // Finalize with accumulated text
    const finalText = accumulatedFinalRef.current.trim();
    if (finalText) {
      updateIdeaWithTranscript(finalText);
    }
    
    // Stop recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    
    clearAllTimers();
    
    if (showToast) {
      toast({
        title: "✓ Voice Input Complete",
        description: reason,
      });
    }
    
    // Reset UI state with smooth transition
    setIsAutoStopping(true);
    setTimeout(() => {
      setIsRecording(false);
      setIsAutoStopping(false);
      setInterimTranscript("");
      setRecordingDuration(0);
      accumulatedFinalRef.current = "";
    }, 300);
  };

  const checkSilenceAndStop = () => {
    const now = Date.now();
    const silenceDuration = now - lastSpeechTimeRef.current;
    
    // Stop after 5 seconds of continuous silence
    if (silenceDuration >= 5000 && isRecordingRef.current) {
      finishRecording(true, "Stopped after 5 seconds of silence");
    }
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
      finishRecording(true, "Recording stopped manually");
      return;
    }

    // Initialize recording state
    startIdeaRef.current = idea;
    accumulatedFinalRef.current = "";
    lastSpeechTimeRef.current = Date.now();
    isRecordingRef.current = true;

    setIsRecording(true);
    setIsAutoStopping(false);
    setInterimTranscript("");
    setRecordingDuration(0);
    
    toast({
      title: "🎙️ Listening...",
      description: "Speak naturally. Auto-stops after 5 seconds of silence.",
    });

    // Start duration counter
    durationIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
      checkSilenceAndStop();
    }, 1000);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    // High-accuracy configuration
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy

    recognition.onresult = (event: any) => {
      // Mark speech activity
      lastSpeechTimeRef.current = Date.now();
      
      let currentInterim = "";
      
      // Process all results from the current result index
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        // Get the most confident transcript
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          // Append finalized text (this is accurate and won't change)
          accumulatedFinalRef.current += transcript + " ";
          
          // Update input immediately with finalized text
          updateIdeaWithTranscript(accumulatedFinalRef.current.trim());
        } else {
          // Show interim (not yet finalized) text as preview
          currentInterim = transcript;
        }
      }
      
      setInterimTranscript(currentInterim);
    };

    recognition.onspeechstart = () => {
      lastSpeechTimeRef.current = Date.now();
    };

    recognition.onspeechend = () => {
      // Don't immediately stop - just note the time and let the interval check handle it
      // This allows for natural pauses between sentences
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

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
