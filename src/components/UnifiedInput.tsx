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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs to avoid stale state inside SpeechRecognition callbacks
  const isRecordingRef = useRef(false);
  const startIdeaRef = useRef("");
  const finalTranscriptRef = useRef("");
  const interimTranscriptRef = useRef("");
  const finalizeOnEndRef = useRef(false);
  const { toast } = useToast();
  
  const selectedLang = languages.find((l) => l.id === selectedLanguage);
  const isGenerateEnabled = selectedLanguage && idea.trim().length > 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      finalizeOnEndRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
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

  const clearSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  const finalizeTranscriptToIdea = () => {
    const combined = `${finalTranscriptRef.current} ${interimTranscriptRef.current}`.trim();
    if (!combined) return;

    const base = startIdeaRef.current.trim();
    const next = base ? `${base} ${combined}` : combined;
    onIdeaChange(next);
  };

  const cleanupRecognition = () => {
    clearSilenceTimer();
    recognitionRef.current = null;
    setInterimTranscript("");
    interimTranscriptRef.current = "";
    finalTranscriptRef.current = "";
    setIsAutoStopping(false);
  };

  const requestStop = (reason: "manual" | "silence") => {
    if (!recognitionRef.current) {
      isRecordingRef.current = false;
      setIsRecording(false);
      setIsAutoStopping(false);
      cleanupRecognition();
      return;
    }

    // UI should stop immediately; recognition will finalize on `onend`.
    isRecordingRef.current = false;
    setIsRecording(false);
    setIsAutoStopping(reason === "silence");
    finalizeOnEndRef.current = true;
    clearSilenceTimer();

    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }
  };

  const resetSilenceTimeout = () => {
    clearSilenceTimer();
    // Auto-stop after ~3.5s of continuous silence (target 3–4 seconds)
    silenceTimeoutRef.current = setTimeout(() => {
      if (!isRecordingRef.current) return;

      toast({
        title: "Voice Input Complete",
        description: "Stopped listening due to silence",
      });
      requestStop("silence");
    }, 3500);
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
      toast({
        title: "Voice Input Stopped",
        description: "Recording manually stopped",
      });
      requestStop("manual");
      return;
    }

    // Start new recording session
    startIdeaRef.current = idea;
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    finalizeOnEndRef.current = false;
    isRecordingRef.current = true;

    setIsRecording(true);
    setInterimTranscript("");
    
    toast({
      title: "🎙️ Listening...",
      description: "Speak naturally. I'll stop after 2-3 seconds of silence.",
    });

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = "en-US";
    recognition.interimResults = true; // Enable interim results for live feedback
    recognition.continuous = true; // Keep listening continuously
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      // Reset silence timeout on any speech detection
      resetSilenceTimeout();
      
      let interim = "";
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + " ";
          interimTranscriptRef.current = "";
          // Update the input live with the finalized portion so far
          const finalSoFar = finalTranscriptRef.current.trim();
          const base = startIdeaRef.current.trim();
          onIdeaChange(base ? `${base} ${finalSoFar}` : finalSoFar);
        } else {
          interim = transcript;
        }
      }

      interimTranscriptRef.current = interim;
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        toast({
          title: "Voice Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      }
      isRecordingRef.current = false;
      setIsRecording(false);
      cleanupRecognition();
    };

    recognition.onend = () => {
      // If we intentionally stopped (manual or silence), finalize and cleanup.
      if (finalizeOnEndRef.current) {
        finalizeOnEndRef.current = false;
        finalizeTranscriptToIdea();
        cleanupRecognition();
        return;
      }

      // Browser sometimes ends recognition unexpectedly; restart if user still wants it.
      if (isRecordingRef.current && recognitionRef.current) {
        try {
          recognition.start();
          resetSilenceTimeout();
        } catch {
          isRecordingRef.current = false;
          setIsRecording(false);
          cleanupRecognition();
        }
        return;
      }

      cleanupRecognition();
    };

    recognition.onspeechstart = () => {
      resetSilenceTimeout();
    };

    recognition.onspeechend = () => {
      resetSilenceTimeout();
    };

    try {
      recognition.start();
      resetSilenceTimeout();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      isRecordingRef.current = false;
      setIsRecording(false);
      cleanupRecognition();
    }
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

        {/* Live voice transcript indicator */}
        {isRecording && interimTranscript && (
          <div className="px-1 py-2 text-sm text-muted-foreground italic animate-pulse">
            "{interimTranscript}..."
          </div>
        )}

        {/* Recording status bar */}
        {(isRecording || isAutoStopping) && (
          <div
            className={`flex items-center gap-2 px-1 py-2 text-sm transition-opacity duration-200 ${
              isAutoStopping ? "opacity-80" : "opacity-100"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            <span className="font-medium text-destructive">
              {isAutoStopping ? "Finishing..." : "Listening... Click mic to stop"}
            </span>
          </div>
        )}

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

            {/* Voice Button with Visual Indicator */}
            <div className="relative">
              <button
                onClick={handleVoice}
                disabled={isAutoStopping}
                className={`
                  p-2.5 rounded-xl 
                  transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                  ${(isRecording || isAutoStopping)
                    ? "bg-destructive/20 text-destructive"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }
                `}
                title={
                  isAutoStopping
                    ? "Finishing speech recognition..."
                    : isRecording
                      ? "Click to stop recording"
                      : "Voice input"
                }
              >
                {(isRecording || isAutoStopping) ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              
              {/* Pulsing ring indicator when recording */}
              {(isRecording || isAutoStopping) && (
                <>
                  <span className="absolute inset-0 rounded-xl border-2 border-destructive animate-ping opacity-75" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                </>
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
