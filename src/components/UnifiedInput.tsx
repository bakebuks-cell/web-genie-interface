import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Mic, ChevronDown, ChevronRight, Check, ArrowUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MultiProgramModal from "./MultiProgramModal";
import { startTranscription, type TranscriptionConfig } from "@/services/speechTranscription";

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
  const [programMenuOpen, setProgramMenuOpen] = useState(false);
  const [showLangSubmenu, setShowLangSubmenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sessionRef = useRef<{ stop: () => void } | null>(null);
  const startIdeaRef = useRef("");
  const programButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const selectedLang = languages.find((l) => l.id === selectedLanguage);
  const isMultiMode = multiStack.length > 0;
  const hasSelection = !!selectedLanguage || isMultiMode;
  const isGenerateEnabled = hasSelection && idea.trim().length > 0;

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(f => f.name).join(", ");
      toast({ title: "Files Attached", description: `Selected: ${fileNames}` });
    }
    e.target.value = "";
  };

  useEffect(() => {
    return () => {
      sessionRef.current?.stop();
    };
  }, []);

  const stopTranscription = () => {
    sessionRef.current?.stop();
    sessionRef.current = null;
    setIsRecording(false);
  };

  const handleVoice = async () => {
    if (isRecording) {
      console.log("[STT-Backend] Manual stop");
      stopTranscription();
      return;
    }

    startIdeaRef.current = idea;
    setIsRecording(true);
    setDisplayText(idea);

    try {
      const session = await startTranscription({
        silenceTimeout: 3000,
        chunkInterval: 250,
        onInterim: (text) => {
          console.log("[STT-Backend] Interim:", text);
          const base = startIdeaRef.current.trim();
          const display = base ? base + " " + text : text;
          setDisplayText(display);
        },
        onFinal: (text) => {
          console.log("[STT-Backend] Final:", text);
          const base = startIdeaRef.current.trim();
          const result = base ? base + " " + text : text;
          setDisplayText(result);
          onIdeaChange(result);
        },
        onError: (msg) => {
          console.error("[STT-Backend] Error:", msg);
          toast({ title: "Voice input failed. Please try again.", variant: "destructive" });
          stopTranscription();
        },
        onStatusChange: (status) => {
          console.log("[STT-Backend] Status:", status);
          if (status === "stopped") {
            setIsRecording(false);
            sessionRef.current = null;
          }
        },
      });
      sessionRef.current = session;
    } catch (err) {
      console.error("[STT-Backend] Failed to start:", err);
      toast({ title: "Voice input failed. Please try again.", variant: "destructive" });
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (!isRecording) { setDisplayText(idea); }
  }, [idea, isRecording]);

  // When multi-program stack is applied, clear single language
  const handleMultiStackApply = (stacks: string[]) => {
    onMultiStackChange(stacks);
    if (stacks.length > 0) {
      // Clear single language when multi is active
      onLanguageSelect(null);
    }
  };

  // When single language is selected, clear multi stack
  const handleLanguageSelect = (langId: string) => {
    onLanguageSelect(langId);
    if (multiStack.length > 0) {
      onMultiStackChange([]);
    }
  };

  const handleGenerate = () => {
    if (!hasSelection) {
      setValidationError("Please select Single Language or Multi Program to continue.");
      setAttentionPulse(true);
      setTimeout(() => setAttentionPulse(false), 1000);
      programButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setProgramMenuOpen(true);
      return;
    }

    const generationMode: GenerationMode = isMultiMode
      ? { mode: "multi", singleLanguage: null, multiStack }
      : { mode: "single", singleLanguage: selectedLanguage, multiStack: [] };

    onGenerate(generationMode);
  };

  // Close menu on outside click
  useEffect(() => {
    if (!programMenuOpen) { setShowLangSubmenu(false); return; }
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          programButtonRef.current && !programButtonRef.current.contains(e.target as Node)) {
        setProgramMenuOpen(false);
        setShowLangSubmenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [programMenuOpen]);

  // Close on ESC
  useEffect(() => {
    if (!programMenuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setProgramMenuOpen(false); setShowLangSubmenu(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [programMenuOpen]);

  // Derive button label
  const allMultiItems = [
    { id: "react", name: "React" }, { id: "vue", name: "Vue.js" }, { id: "angular", name: "Angular" }, { id: "nextjs", name: "Next.js" },
    { id: "nodejs", name: "Node.js" }, { id: "django", name: "Django" }, { id: "springboot", name: "Spring Boot" }, { id: "aspnet", name: "ASP.NET" }, { id: "laravel", name: "PHP (Laravel)" },
    { id: "postgresql", name: "PostgreSQL" }, { id: "mysql", name: "MySQL" }, { id: "mongodb", name: "MongoDB" }, { id: "supabase", name: "Supabase" },
  ];

  const getProgramLabel = () => {
    if (isMultiMode) {
      const names = multiStack.map(id => allMultiItems.find(i => i.id === id)?.name || id);
      return `Multi: ${names.join(" \u2022 ")}`;
    }
    if (selectedLang) {
      return `Single: ${selectedLang.name}`;
    }
    return "Select Program";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
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
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

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
          {/* Select Program unified button */}
          <div className="flex flex-col gap-1 relative">
            <button
              ref={programButtonRef}
              onClick={() => { setProgramMenuOpen(prev => !prev); setShowLangSubmenu(false); }}
              className={`
                flex items-center gap-2 px-3 py-2
                rounded-lg border transition-all duration-200
                text-sm max-w-[280px]
                ${hasSelection
                  ? "bg-primary/10 border-primary/30 text-foreground"
                  : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/40 hover:bg-secondary/50"
                }
                ${attentionPulse ? "animate-[pulse_0.5s_ease-in-out_2] border-primary shadow-[0_0_16px_rgba(0,230,210,0.5)]" : ""}
              `}
            >
              <span className="font-medium truncate">{getProgramLabel()}</span>
              <ChevronDown className={`w-4 h-4 opacity-50 shrink-0 transition-transform ${programMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {programMenuOpen && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 bottom-full mb-2 z-[100] min-w-[240px] rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(20, 24, 30, 0.95)",
                    border: "1px solid rgba(0, 230, 210, 0.25)",
                    boxShadow: "0 0 30px rgba(0, 230, 210, 0.12), 0 8px 32px rgba(0,0,0,0.4)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {!showLangSubmenu ? (
                    <div className="py-1.5">
                      {/* Single Language option */}
                      <button
                        onClick={() => setShowLangSubmenu(true)}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 text-sm font-medium
                          transition-colors duration-150
                          ${selectedLanguage ? "text-primary bg-primary/5" : "text-foreground hover:bg-accent/10"}
                        `}
                      >
                        <span>Single Language</span>
                        <div className="flex items-center gap-2">
                          {selectedLang && <span className="text-xs text-muted-foreground">{selectedLang.name}</span>}
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </div>
                      </button>
                      {/* Multi Program option */}
                      <button
                        onClick={() => {
                          setProgramMenuOpen(false);
                          setShowLangSubmenu(false);
                          setMultiProgramOpen(true);
                        }}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 text-sm font-medium
                          transition-colors duration-150
                          ${isMultiMode ? "text-primary bg-primary/5" : "text-foreground hover:bg-accent/10"}
                        `}
                      >
                        <span>Multi Program</span>
                        {isMultiMode && <span className="text-xs text-muted-foreground">{multiStack.length} selected</span>}
                      </button>
                    </div>
                  ) : (
                    <div className="py-1.5">
                      {/* Back button */}
                      <button
                        onClick={() => setShowLangSubmenu(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-accent/10 transition-colors border-b border-border/20"
                      >
                        <ChevronRight className="w-3 h-3 rotate-180" />
                        <span>Back</span>
                      </button>
                      {/* Language list */}
                      {languages.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => {
                            handleLanguageSelect(lang.id);
                            setProgramMenuOpen(false);
                            setShowLangSubmenu(false);
                          }}
                          className={`
                            w-full flex items-center justify-between px-4 py-2.5 text-sm
                            transition-colors duration-150 cursor-pointer
                            ${selectedLanguage === lang.id
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-accent/10"
                            }
                          `}
                        >
                          <span className="font-medium">{lang.name}</span>
                          {selectedLanguage === lang.id && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Validation error */}
            <AnimatePresence>
              {validationError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs text-destructive pl-1"
                >
                  {validationError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

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

            <button
              onClick={handleGenerate}
              className={`
                flex items-center justify-center p-2.5 rounded-xl 
                transition-all duration-300 active:scale-95
                ${isGenerateEnabled
                  ? "text-primary-foreground hover:opacity-90 shadow-[0_0_20px_rgba(0,255,200,0.3)]"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }
              `}
              style={isGenerateEnabled ? {
                background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
              } : undefined}
              title={isGenerateEnabled ? "Generate Application" : "Select program and describe your idea first"}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

          <MultiProgramModal
            open={multiProgramOpen}
            onClose={() => setMultiProgramOpen(false)}
            selectedStacks={multiStack}
            onApply={handleMultiStackApply}
          />
        </div>
      </div>
    </div>
  );
};

export default UnifiedInput;
