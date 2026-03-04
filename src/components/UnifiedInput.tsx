import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Mic, ChevronDown, Check, X, Layers, ArrowUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MultiProgramModal from "./MultiProgramModal";

export interface GenerationMode {
  mode: "single" | "multi";
  singleLanguage: string | null;
  multiStack: string[];
}

interface UnifiedInputProps {
  selectedLanguage: string | null;
  onLanguageSelect: (language: string | null) => void;
  idea: string;
  onIdeaChange: (idea: string) => void;
  onGenerate: (generationMode: GenerationMode) => void;
  multiStack: string[];
  onMultiStackChange: (stacks: string[]) => void;
}

const languages = [
  { id: "html", name: "Plain HTML/CSS/JS" },
  { id: "php", name: "PHP" },
  { id: "nodejs", name: "Node/TS" },
  { id: "python", name: "Python" },
  { id: "golang", name: "Golang" },
  { id: "react", name: "React" },
  { id: "java", name: "Java (Enterprise)" },
  { id: "csharp", name: "ASP.NET (C#)" },
];

const UnifiedInput = ({
  selectedLanguage,
  onLanguageSelect,
  idea,
  onIdeaChange,
  onGenerate,
  multiStack,
  onMultiStackChange,
}: UnifiedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [multiProgramOpen, setMultiProgramOpen] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [validationError, setValidationError] = useState("");
  const [attentionPulse, setAttentionPulse] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isRecordingRef = useRef(false);
  const startIdeaRef = useRef("");
  const accumulatedFinalRef = useRef("");
  const currentInterimRef = useRef("");
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const { toast } = useToast();
  
  const selectedLang = languages.find((l) => l.id === selectedLanguage);
  const isMultiMode = multiStack.length > 0;
  const hasSelection = !!selectedLanguage || isMultiMode;
  const isGenerateEnabled = hasSelection && idea.trim().length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    if (!langDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langDropdownOpen]);

  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch {} }
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (finalizeTimeoutRef.current) clearTimeout(finalizeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (hasSelection) setValidationError("");
  }, [hasSelection]);

  const handleAttach = () => { fileInputRef.current?.click(); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(f => f.name).join(", ");
      toast({ title: "Files Attached", description: `Selected: ${fileNames}` });
    }
    e.target.value = "";
  };

  const clearTimers = () => {
    if (silenceTimeoutRef.current) { clearTimeout(silenceTimeoutRef.current); silenceTimeoutRef.current = null; }
    if (finalizeTimeoutRef.current) { clearTimeout(finalizeTimeoutRef.current); finalizeTimeoutRef.current = null; }
  };

  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => { if (isRecordingRef.current) finishRecording(); }, 5000);
  };

  const updateDisplayText = () => {
    const parts: string[] = [];
    if (startIdeaRef.current.trim()) parts.push(startIdeaRef.current.trim());
    if (accumulatedFinalRef.current.trim()) parts.push(accumulatedFinalRef.current.trim());
    if (currentInterimRef.current.trim()) parts.push(currentInterimRef.current.trim());
    setDisplayText(parts.join(" "));
  };

  const finishRecording = () => {
    if (!isRecordingRef.current) return;
    isRecordingRef.current = false;
    clearTimers();
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} }
    finalizeTimeoutRef.current = setTimeout(() => {
      const parts: string[] = [];
      if (startIdeaRef.current.trim()) parts.push(startIdeaRef.current.trim());
      if (accumulatedFinalRef.current.trim()) parts.push(accumulatedFinalRef.current.trim());
      const finalText = parts.join(" ");
      onIdeaChange(finalText);
      setDisplayText(finalText);
      if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch {} recognitionRef.current = null; }
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
        if (result.isFinal) { accumulatedFinalRef.current += result[0].transcript; currentInterimRef.current = ""; }
        else { currentInterimRef.current = result[0].transcript; }
      }
      updateDisplayText();
    };

    recognition.onspeechstart = () => { lastSpeechTimeRef.current = Date.now(); resetSilenceTimer(); };
    recognition.onspeechend = () => {};
    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      toast({ title: "Voice Error", description: `Error: ${event.error}`, variant: "destructive" });
      isRecordingRef.current = false; setIsRecording(false); clearTimers();
    };
    recognition.onend = () => {
      if (isRecordingRef.current && recognitionRef.current === recognition) {
        try { recognition.start(); } catch { finishRecording(); }
      }
    };

    try { recognition.start(); } catch {
      isRecordingRef.current = false; setIsRecording(false); clearTimers();
      toast({ title: "Voice Error", description: "Failed to start voice recognition.", variant: "destructive" });
    }
  };

  useEffect(() => { if (!isRecording) setDisplayText(idea); }, [idea, isRecording]);

  const handleMultiStackApply = (stacks: string[]) => {
    onMultiStackChange(stacks);
    if (stacks.length > 0) onLanguageSelect(null);
  };

  const handleLanguageSelect = (langId: string) => {
    onLanguageSelect(langId);
    if (multiStack.length > 0) onMultiStackChange([]);
    setLangDropdownOpen(false);
  };

  const handleGenerate = () => {
    if (!hasSelection) {
      setValidationError("Please select a language or choose a Multi-Program stack.");
      setAttentionPulse(true);
      setTimeout(() => setAttentionPulse(false), 1000);
      langButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setLangDropdownOpen(true);
      return;
    }
    const generationMode: GenerationMode = isMultiMode
      ? { mode: "multi", singleLanguage: null, multiStack }
      : { mode: "single", singleLanguage: selectedLanguage, multiStack: [] };
    onGenerate(generationMode);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative flex flex-col p-4 rounded-2xl backdrop-blur-lg transition-all duration-300 ease-out
          glass-panel-strong
          ${isFocused
            ? "shadow-[0_0_40px_hsl(var(--glow)/0.3),0_0_80px_hsl(var(--glow)/0.1)]"
            : "shadow-[0_0_30px_hsl(var(--glow)/0.15),0_0_60px_hsl(var(--glow)/0.05)]"
          }
        `}
        style={{ border: `1px solid hsl(var(--glow) / ${isFocused ? 0.25 : 0.15})` }}
      >
        <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileChange} className="hidden" />

        <textarea
          value={displayText}
          onChange={(e) => { if (!isRecording) onIdeaChange(e.target.value); }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your application idea..."
          rows={3}
          className="w-full px-1 py-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none text-sm leading-relaxed resize-none scrollbar-hide"
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Language Dropdown - custom pill style */}
              <div ref={dropdownRef} className="relative">
                <button
                  ref={langButtonRef}
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className={`
                    flex items-center gap-2 px-3.5 py-2 h-9
                    rounded-[var(--radius)] border transition-all duration-200 text-sm
                    ${selectedLanguage
                      ? "bg-primary/10 border-primary/25 text-foreground shadow-[0_0_12px_hsl(var(--glow)/0.1)]"
                      : isMultiMode
                        ? "bg-secondary/20 border-border/30 text-muted-foreground/50 opacity-60"
                        : "bg-secondary/40 border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-secondary/60"
                    }
                    ${attentionPulse && !isMultiMode ? "animate-[pulse_0.5s_ease-in-out_2] border-primary shadow-glow" : ""}
                  `}
                >
                  <span className="font-medium">{selectedLang ? selectedLang.name : "Select Language"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 opacity-50 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {langDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 left-0 z-[100] w-56 rounded-xl glass-panel-strong shadow-large overflow-hidden"
                    >
                      <div className="py-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => handleLanguageSelect(lang.id)}
                            className={`
                              w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150
                              ${selectedLanguage === lang.id
                                ? "bg-primary/10 text-primary"
                                : "text-foreground/80 hover:bg-primary/5 hover:text-foreground"
                              }
                            `}
                          >
                            <span className="font-medium">{lang.name}</span>
                            {selectedLanguage === lang.id && <Check className="w-4 h-4 ml-auto text-primary" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Multi-Program Button */}
              <button
                onClick={() => setMultiProgramOpen(true)}
                className={`
                  flex items-center gap-2 px-3.5 py-2 h-9
                  rounded-[var(--radius)] border transition-all duration-200 text-sm
                  ${isMultiMode
                    ? "bg-primary/10 border-primary/25 text-foreground shadow-[0_0_12px_hsl(var(--glow)/0.1)]"
                    : "bg-secondary/40 border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-secondary/60"
                  }
                  ${attentionPulse && !selectedLanguage && !isMultiMode ? "animate-[pulse_0.5s_ease-in-out_2] border-primary shadow-glow" : ""}
                `}
              >
                <Layers className="w-4 h-4" />
                <span className="font-medium">
                  {isMultiMode ? `Multi-Program (${multiStack.length})` : "Multi-Program"}
                </span>
              </button>
            </div>
            <AnimatePresence>
              {validationError && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-destructive pl-1">
                  {validationError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5">
            <button onClick={handleAttach} className="p-2.5 rounded-[var(--radius)] text-muted-foreground hover:text-foreground hover:bg-secondary/60 active:scale-95 transition-all duration-200" title="Attach file">
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={handleVoice}
                className={`relative p-2.5 rounded-[var(--radius)] transition-all duration-300 active:scale-95 ${isRecording ? "bg-primary/20 text-primary animate-[float_2s_ease-in-out_infinite]" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}
                title={isRecording ? "Click to stop" : "Voice input"}
              >
                <Mic className="w-5 h-5" />
              </button>
              {isRecording && <span className="absolute inset-0 rounded-[var(--radius)] border-2 border-primary/50 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none" />}
            </div>

            <button
              onClick={handleGenerate}
              className={`flex items-center justify-center p-2.5 rounded-[var(--radius)] transition-all duration-250 active:scale-95 ${isGenerateEnabled ? "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_20px_hsl(var(--glow)/0.3)]" : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"}`}
              title={isGenerateEnabled ? "Generate Application" : "Select language and describe your idea first"}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

          <MultiProgramModal open={multiProgramOpen} onClose={() => setMultiProgramOpen(false)} selectedStacks={multiStack} onApply={handleMultiStackApply} />
        </div>
      </div>
    </div>
  );
};

export default UnifiedInput;
