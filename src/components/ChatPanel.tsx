import { useEffect, useRef, useCallback, useTransition, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Paperclip,
  SendIcon,
  XIcon,
  LoaderIcon,
  Command,
  Bot,
  User,
  Code,
  Palette,
  Zap,
  RefreshCw,
  Mic,
  MicOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditsDisplay } from "./CreditsDisplay";
import { UpgradePrompt } from "./UpgradePrompt";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCredits } from "@/hooks/useCredits";

// Extend Window interface for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}
import * as React from "react";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  selectedStack?: string;
}

const ChatPanel = ({ selectedStack = "node-react" }: ChatPanelProps) => {
  const navigate = useNavigate();
  const { user, profile, deductCredit: authDeductCredit } = useAuth();
  const { credits: guestCredits, hasCredits: guestHasCredits, deductCredit: guestDeductCredit } = useGuestCredits();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "I'm generating your application. You can give me additional instructions to customize it!",
    },
  ]);
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 44,
    maxHeight: 120,
  });
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Determine if user has credits
  const isAuthenticated = !!user;
  const isUnlimited = profile?.plan === 'pro' || profile?.plan === 'enterprise';
  const hasCredits = isAuthenticated ? (isUnlimited || (profile?.plan === 'free')) : guestHasCredits;

  const commandSuggestions: CommandSuggestion[] = [
    {
      icon: <Code className="w-4 h-4" />,
      label: "Add Feature",
      description: "Add a new feature to your app",
      prefix: "/feature",
    },
    {
      icon: <Palette className="w-4 h-4" />,
      label: "Change Style",
      description: "Modify colors, fonts, or layout",
      prefix: "/style",
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: "Optimize",
      description: "Improve performance or code quality",
      prefix: "/optimize",
    },
    {
      icon: <RefreshCw className="w-4 h-4" />,
      label: "Refactor",
      description: "Restructure existing code",
      prefix: "/refactor",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true);
      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) =>
        cmd.prefix.startsWith(value)
      );
      if (matchingSuggestionIndex >= 0) {
        setActiveSuggestion(matchingSuggestionIndex);
      } else {
        setActiveSuggestion(-1);
      }
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const commandButton = document.querySelector("[data-command-button]");
      if (
        commandPaletteRef.current &&
        !commandPaletteRef.current.contains(target) &&
        !commandButton?.contains(target)
      ) {
        setShowCommandPalette(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setValue(prev => prev + transcript);
        adjustHeight();
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [adjustHeight]);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < commandSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev > 0 ? prev - 1 : commandSuggestions.length - 1
        );
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion];
          setValue(selectedCommand.prefix + " ");
          setShowCommandPalette(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        handleSendMessage();
      }
    }
  };

  const handleSendMessage = async () => {
    if (value.trim()) {
      const promptText = value;
      const selectedLanguage = selectedStack;

      // Check credits before sending
      let canProceed = false;
      
      if (isAuthenticated) {
        if (isUnlimited) {
          canProceed = true;
        } else {
          canProceed = await authDeductCredit();
        }
      } else {
        canProceed = guestDeductCredit();
      }
      
      if (!canProceed) {
        setShowUpgradePrompt(true);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "You've run out of credits for today. Sign in or upgrade to continue building!",
          },
        ]);
        return;
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: promptText,
      };
      setMessages((prev) => [...prev, newMessage]);

      setIsTyping(true);
      setValue("");
      setAttachments([]);
      adjustHeight(true);

      try {
        const response = await fetch("https://703l8k0g-3000.inc1.devtunnels.ms/build", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptText, stack: selectedLanguage }),
        });

        const data = await response.json();
        
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.response || data.message || "I'll make those changes for you. Updating the application now...",
          },
        ]);
      } catch (error) {
        console.error("API error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Sorry, there was an error connecting to the server. Please try again.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleAttachFile = () => {
    const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`;
    setAttachments((prev) => [...prev, mockFileName]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index];
    setValue(selectedCommand.prefix + " ");
    setShowCommandPalette(false);
  };

  return (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-xl border-r border-border">
      {/* Header with Credits */}
      <div className="p-4 border-b border-border space-y-3">
        <div>
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Assistant
          </h2>
          <p className="text-sm text-muted-foreground">Edit your application with natural language</p>
        </div>
        <CreditsDisplay onUpgradeClick={() => navigate('/pricing')} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === "user" ? "bg-primary" : "bg-secondary"
              )}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Bot className="w-4 h-4 text-foreground" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-2xl text-sm",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              )}
            >
              {message.content}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-foreground" />
              </div>
              <div className="bg-secondary p-3 rounded-2xl flex items-center gap-1">
                {[1, 2, 3].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.85, 1.1, 0.85],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: dot * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-border">
        <div className="relative">
          {/* Command Palette */}
          <AnimatePresence>
            {showCommandPalette && (
              <motion.div
                ref={commandPaletteRef}
                className="absolute left-0 right-0 bottom-full mb-2 backdrop-blur-xl bg-popover/95 rounded-lg z-50 shadow-lg border border-border overflow-hidden"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
              >
                <div className="py-1">
                  {commandSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.prefix}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-colors",
                        activeSuggestion === index
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent/50"
                      )}
                      onClick={() => selectCommandSuggestion(index)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <div className="w-5 h-5 flex items-center justify-center text-muted-foreground">
                        {suggestion.icon}
                      </div>
                      <div className="font-medium">{suggestion.label}</div>
                      <div className="text-muted-foreground text-xs ml-1">
                        {suggestion.prefix}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attachments */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div
                className="mb-2 flex gap-2 flex-wrap"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {attachments.map((file, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 text-xs bg-secondary py-1.5 px-3 rounded-lg text-foreground"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <span>{file}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input container */}
          <div className="flex items-end gap-2 bg-secondary/50 rounded-xl p-2 border border-border focus-within:border-primary/50 transition-colors">
            <div className="flex items-center gap-1">
              <motion.button
                type="button"
                onClick={handleAttachFile}
                whileTap={{ scale: 0.94 }}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </motion.button>
              <motion.button
                type="button"
                data-command-button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCommandPalette((prev) => !prev);
                }}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  "p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors",
                  showCommandPalette && "bg-accent text-foreground"
                )}
              >
                <Command className="w-4 h-4" />
              </motion.button>
            </div>

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your instructions..."
              className={cn(
                "flex-1 px-2 py-2 resize-none bg-transparent",
                "text-foreground text-sm focus:outline-none",
                "placeholder:text-muted-foreground min-h-[44px]"
              )}
              style={{ overflow: "hidden" }}
            />

            {/* Voice Button */}
            <motion.button
              type="button"
              onClick={toggleVoiceRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-2.5 rounded-lg text-sm font-medium transition-all relative",
                isRecording
                  ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-destructive"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </motion.button>

            {/* Send Button */}
            <motion.button
              type="button"
              onClick={handleSendMessage}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isTyping || !value.trim()}
              className={cn(
                "p-2.5 rounded-lg text-sm font-medium transition-all",
                value.trim()
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isTyping ? (
                <LoaderIcon className="w-4 h-4 animate-spin" />
              ) : (
                <SendIcon className="w-4 h-4" />
              )}
            </motion.button>
          </div>

          {/* Quick commands */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {commandSuggestions.slice(0, 3).map((suggestion, index) => (
              <motion.button
                key={suggestion.prefix}
                onClick={() => selectCommandSuggestion(index)}
                className="flex items-center gap-1.5 px-2 py-1 bg-secondary/50 hover:bg-secondary rounded-md text-xs text-muted-foreground hover:text-foreground transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {suggestion.icon}
                <span>{suggestion.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
