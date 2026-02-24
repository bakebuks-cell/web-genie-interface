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
  Target,
  X,
  Lock,
  ChevronDown,
  Pencil,
  Trash2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditsDisplay } from "./CreditsDisplay";
import { UpgradePrompt } from "./UpgradePrompt";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCredits } from "@/hooks/useCredits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { saveRecentProject } from "./RecentProjectCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

// ── Robust project name extraction ──────────────────────────────────
const FILLER_WORDS = new Set([
  "a","an","the","my","our","your","this","that",
]);

const GENERIC_WORDS = new Set([
  "build","create","make","design","develop","generate","write","code",
  "website","site","web","app","application","system","platform","tool",
  "page","project","software","program","ai","an","a","the","my","our",
  "for","with","using","please","i","want","need","would","like","to",
  "that","this","is","it","me","can","you","some","new","simple","basic",
  "full","complete","modern","beautiful","nice","good","great","cool",
]);

function sanitizeName(raw: string): string {
  let s = raw.trim();
  // Remove surrounding quotes
  s = s.replace(/^["'""\u201C\u201D]+|["'""\u201C\u201D]+$/g, "");
  // Remove trailing punctuation
  s = s.replace(/[.,!?:;]+$/, "").trim();
  // Remove leading filler words (only single filler, not part of the name)
  s = s.replace(/^(a|an|the|my|our|your)\s+/i, "").trim();
  // Remove sneaked-in generic verbs at the start
  s = s.replace(/^(website|app|application|create|build|for)\s+/i, "").trim();
  // Truncate to 40 chars without cutting words
  if (s.length > 40) {
    const words = s.split(/\s+/);
    let result = "";
    for (const w of words) {
      if ((result + " " + w).trim().length > 40) break;
      result = (result + " " + w).trim();
    }
    s = result;
  }
  return s || "";
}

function getProjectName(prompt: string): string {
  if (!prompt || !prompt.trim()) return "Untitled Project";
  const p = prompt.trim();

  // Priority A-D: explicit "X name is/: <name>"
  const explicitPatterns = [
    /\b(?:app|application)\s+name[\s:]+(?:is\s+)?(.+)/i,
    /\bproject\s+name[\s:]+(?:is\s+)?(.+)/i,
    /\b(?:website|site)\s+name[\s:]+(?:is\s+)?(.+)/i,
    /\b(?:company|brand)\s+name[\s:]+(?:is\s+)?(.+)/i,
  ];
  for (const rx of explicitPatterns) {
    const m = p.match(rx);
    if (m) { const c = sanitizeName(m[1]); if (c) return c; }
  }

  // Priority E: call it / name it / called / named / titled
  const namedMatch = p.match(/\b(?:call\s+it|name\s+it|called|named|titled)\s+(.+)/i);
  if (namedMatch) { const c = sanitizeName(namedMatch[1]); if (c) return c; }

  // Priority F: "for <Name>" - capture proper noun sequence (starts with uppercase)
  const forProperMatch = p.match(/\bfor\s+(?:my\s+|our\s+|a\s+|an\s+|the\s+)?([A-Z][A-Za-z0-9 .'&-]*)/);
  if (forProperMatch) {
    const c = sanitizeName(forProperMatch[1]);
    if (c && c.split(/\s+/).length <= 5) return c;
  }

  // Priority F2: "for <name>" case-insensitive, filter generics
  const forMatch2 = p.match(/\bfor\s+(?:a\s+|an\s+|the\s+|my\s+|our\s+)?(.+?)(?:[.,!?]|$)/i);
  if (forMatch2) {
    const raw = sanitizeName(forMatch2[1]);
    const words = raw.split(/\s+/).filter(w => !GENERIC_WORDS.has(w.toLowerCase()) && w.length > 1);
    if (words.length > 0 && words.length <= 4) return words.join(" ");
  }

  // Priority G: quoted names
  const quoteMatch = p.match(/["""\u201C]([^"""\u201D]+)["""\u201D]/) || p.match(/'([^']+)'/);
  if (quoteMatch) { const c = sanitizeName(quoteMatch[1]); if (c) return c; }

  // Fallback: meaningful keywords → brandable name
  const words = p.split(/\s+/).filter(w => !GENERIC_WORDS.has(w.toLowerCase()) && w.length > 2);
  if (words.length >= 2) {
    const a = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    const b = words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
    return a + b;
  }
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }

  return "Untitled Project";
}

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

export interface HealthCheckStatus {
  isChecking: boolean;
  isReady: boolean;
  elapsedSeconds: number;
  error?: string;
}

export interface ChatPanelProps {
  selectedStack?: string;
  initialPrompt?: string;
  onGeneratedUrl?: (url: string, projectId?: string) => void;
  onHealthCheckStatus?: (status: HealthCheckStatus) => void;
  projectId?: string | null;
  selectedElementId?: string | null;
  onClearElement?: () => void;
}

const ChatPanel = ({ 
  selectedStack = "react", 
  initialPrompt = "", 
  onGeneratedUrl, 
  onHealthCheckStatus,
  projectId,
  selectedElementId,
  onClearElement
}: ChatPanelProps) => {
  const navigate = useNavigate();
  const { user, profile, userCredits, deductCredit: authDeductCredit } = useAuth();
  const { credits: guestCredits, hasCredits: guestHasCredits, deductCredit: guestDeductCredit } = useGuestCredits();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "I'm ready to generate your application. Describe what you want to build!",
    },
  ]);
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isModifying, setIsModifying] = useState(false); // Track if we're in modify mode for loading message
  const [isPending, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // showCreditsDialog removed - credits now inline in dropdown
  
  const [projectName, setProjectName] = useState(() => getProjectName(initialPrompt));
  const [renameValue, setRenameValue] = useState("");
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 80,
    maxHeight: 180,
  });
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Determine if user has credits
  const isAuthenticated = !!user;
  const isUnlimited = profile?.plan === 'pro' || profile?.plan === 'enterprise';
  const currentCredits = isAuthenticated ? (userCredits?.credits_remaining ?? 0) : guestCredits;
  const hasCredits = isUnlimited || currentCredits > 0;

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

  // Auto-trigger build when initialPrompt is provided from landing page
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && !hasAutoTriggered) {
      setHasAutoTriggered(true);
      // Set the value and trigger send after a short delay to ensure component is ready
      setValue(initialPrompt);
      const timer = setTimeout(() => {
        triggerBuild(initialPrompt);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, hasAutoTriggered]);

  // Helper function to make fetch request to localhost backend (waits up to 10 minutes for Docker)
  const fetchBuild = async (prompt: string, stack: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes timeout (600,000ms)

    console.log("[fetchBuild] Sending request to localhost backend (sync mode, 10 min timeout)...", { prompt, stack });

    try {
      const response = await fetch("http://localhost:3000/build", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ prompt, stack }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("[fetchBuild] Response status:", response.status);
      
      if (!response.ok) {
        console.error("[fetchBuild] Response not OK:", response.status, response.statusText);
        return { success: false, error: 'server_error' };
      }

      const rawText = await response.text();
      console.log("[fetchBuild] Raw response from backend:", rawText);

      const data = JSON.parse(rawText);
      console.log("[fetchBuild] Parsed response:", data);

      return { success: true, data };
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        console.error("[fetchBuild] Request timed out after 10 minutes");
        return { success: false, error: 'timeout' };
      } else {
        console.error("[fetchBuild] API error:", error.message || error);
        return { success: false, error: 'network' };
      }
    }
  };

  // Helper function to make fetch request for modification
  const fetchModify = async (
    prompt: string, 
    stack: string, 
    projectIdToModify: string, 
    elementId: string | null
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes timeout

    console.log("[fetchModify] Sending modification request...", { 
      projectId: projectIdToModify, 
      stack, 
      prompt, 
      elementId 
    });

    try {
      const response = await fetch("http://localhost:3000/modify", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          projectId: projectIdToModify,
          stack, 
          prompt, 
          elementId 
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("[fetchModify] Response status:", response.status);
      
      if (!response.ok) {
        console.error("[fetchModify] Response not OK:", response.status, response.statusText);
        return { success: false, error: 'server_error' };
      }

      const rawText = await response.text();
      console.log("[fetchModify] Raw response from backend:", rawText);

      const data = JSON.parse(rawText);
      console.log("[fetchModify] Parsed response:", data);

      return { success: true, data };
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        console.error("[fetchModify] Request timed out after 10 minutes");
        return { success: false, error: 'timeout' };
      } else {
        console.error("[fetchModify] API error:", error.message || error);
        return { success: false, error: 'network' };
      }
    }
  };

  // No more polling - backend now waits synchronously. Just mark as ready immediately.
  const markAsReady = (url: string) => {
    console.log("[markAsReady] Backend returned URL, marking as ready:", url);
    onHealthCheckStatus?.({
      isChecking: false,
      isReady: true,
      elapsedSeconds: 0,
    });
  };

  // Separate function to trigger build with specific prompt (for auto-trigger)
  const triggerBuild = async (prompt: string) => {
    if (!prompt.trim()) return;

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
      content: prompt,
    };
    setMessages((prev) => [...prev, newMessage]);

    setIsTyping(true);
    setValue("");
    setAttachments([]);
    adjustHeight(true);

    try {
      const result = await fetchBuild(prompt, selectedStack);

      if (result.success && result.data) {
        const data = result.data;
        if (data.success && data.url) {
          onGeneratedUrl?.(data.url);
          
          // Save recent project
          saveRecentProject({
            projectId: data.projectId || Date.now().toString(),
            projectName,
            promptText: prompt,
            mode: "single",
            singleLanguage: selectedStack,
            language: selectedStack,
            idea: prompt,
            updatedAt: new Date().toISOString(),
          });
          
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              role: "assistant",
              content: `🚀 Your app is ready!\n\nURL: ${data.url}`,
            },
          ]);

          // Mark as ready immediately - no more polling
          markAsReady(data.url);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              role: "assistant",
              content: data.response || data.message || "I'll make those changes for you. Updating the application now...",
            },
          ]);
        }
      } else {
        const errorMessage = result.error === 'timeout'
          ? "The request timed out after 10 minutes. Please try again."
          : "Sorry, there was an error connecting to the server. Please check your connection and try again.";
        
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: errorMessage,
          },
        ]);
      }
    } catch (error: any) {
      console.error("[triggerBuild] Unexpected error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "An unexpected error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

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
      const isModifyMode = !!projectId;

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

      // Show element context in message if targeting
      const messageContent = selectedElementId 
        ? `${promptText}\n\n🎯 Targeting: ${selectedElementId}`
        : promptText;

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageContent,
      };
      setMessages((prev) => [...prev, newMessage]);

      setIsTyping(true);
      setIsModifying(isModifyMode);
      setValue("");
      setAttachments([]);
      adjustHeight(true);

      // Show appropriate loading message
      const loadingMessage = isModifyMode ? "Refining Code..." : "Generating...";

      try {
        let result;
        
        if (isModifyMode) {
          // Use modify endpoint when we have a project
          result = await fetchModify(promptText, selectedLanguage, projectId!, selectedElementId);
          
          // Clear selected element after sending
          onClearElement?.();
        } else {
          // Use build endpoint for initial generation
          result = await fetchBuild(promptText, selectedLanguage);
        }

        if (result.success && result.data) {
          const data = result.data;
          if (data.success && data.url) {
            // Pass projectId if available from response
            onGeneratedUrl?.(data.url, data.projectId);
            
            // Save recent project on successful generation
            saveRecentProject({
              projectId: data.projectId || Date.now().toString(),
              projectName,
              promptText: promptText,
              mode: "single",
              singleLanguage: selectedLanguage,
              language: selectedLanguage,
              idea: promptText,
              updatedAt: new Date().toISOString(),
            });
            
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 2).toString(),
                role: "assistant",
                content: isModifyMode 
                  ? `✅ Code updated successfully!\n\nURL: ${data.url}`
                  : `🚀 Your app is ready!\n\nURL: ${data.url}`,
              },
            ]);
            
            // Mark as ready immediately
            markAsReady(data.url);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 2).toString(),
                role: "assistant",
                content: data.response || data.message || "I'll make those changes for you. Updating the application now...",
              },
            ]);
          }
        } else {
          const errorMessage = result.error === 'timeout'
            ? "The request timed out. Please try again."
            : "Sorry, there was an error connecting to the server. Please check your connection and try again.";
          
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              role: "assistant",
              content: errorMessage,
            },
          ]);
        }
      } catch (error: any) {
        console.error("[handleSendMessage] Unexpected error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "An unexpected error occurred. Please try again.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleAttachFile = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to attach files");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setIsUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 10MB.`);
          continue;
        }

        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        
        const { error } = await supabase.storage
          .from('chat-attachments')
          .upload(fileName, file);

        if (error) {
          toast.error(`Failed to upload ${file.name}`);
          console.error('Upload error:', error);
        } else {
          setAttachments((prev) => [...prev, file.name]);
          toast.success(`${file.name} uploaded`);
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
      {/* Header with Project Name */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary flex-shrink-0" />
          <h2 className={cn(
            "font-semibold truncate text-base",
            projectName === "Untitled Project" ? "text-muted-foreground italic" : "text-foreground"
          )}>{projectName}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors flex-shrink-0">
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-popover border-border z-50 p-0">
              {/* Big Credits Display */}
              <div className="px-4 py-4 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">
                    {isUnlimited ? (
                      <span className="text-amber-500">Unlimited</span>
                    ) : (
                      <>
                        <span className={currentCredits > 0 ? "text-primary" : "text-destructive"}>{currentCredits}</span>
                        <span className="text-muted-foreground font-normal text-base"> / 5 today</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Daily generation credits</p>
                {!isUnlimited && (
                  <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        currentCredits > 2
                          ? "bg-gradient-to-r from-primary to-primary/70"
                          : currentCredits > 0
                            ? "bg-amber-500"
                            : "bg-destructive"
                      )}
                      style={{ width: `${(currentCredits / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="py-1">
                <DropdownMenuItem onClick={() => { setRenameValue(projectName === "Untitled Project" ? "" : projectName); setShowRenameDialog(true); }} className="gap-2 cursor-pointer px-4 py-2">
                  <Pencil className="w-4 h-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="gap-2 cursor-pointer text-destructive focus:text-destructive px-4 py-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Enter new name"
            className="bg-secondary/50 border-border"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">Cancel</Button>
            </DialogClose>
            <Button size="sm" onClick={() => { setProjectName(renameValue); setShowRenameDialog(false); }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{projectName}"? This action cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" size="sm" onClick={() => { setShowDeleteDialog(false); toast.success("Project deleted"); navigate("/"); }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credits Dialog removed - now inline in dropdown */}

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

        {/* Typing indicator with dynamic message */}
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
              <div className="bg-secondary p-3 rounded-2xl flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {isModifying ? "Refining Code..." : "Generating..."}
                </span>
                <div className="flex items-center gap-1">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-border">
        {/* Element Targeting Badge */}
        <AnimatePresence>
          {selectedElementId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-2"
            >
              <Badge 
                variant="secondary" 
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/30"
              >
                <Target className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  Targeting: <code className="bg-primary/20 px-1 py-0.5 rounded text-xs">{selectedElementId}</code>
                </span>
                <button
                  onClick={() => onClearElement?.()}
                  className="ml-1 hover:bg-primary/20 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
        
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

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Input container */}
          <div className="flex flex-col bg-secondary/50 rounded-xl border border-border focus-within:border-primary/50 transition-colors">
            {/* Textarea area */}
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
                "w-full pt-3 pl-3 pr-3 pb-2 resize-none bg-transparent",
                "text-foreground text-sm focus:outline-none",
                "placeholder:text-muted-foreground/60 placeholder:text-sm",
                "min-h-[80px] instruction-textarea"
              )}
              style={{
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "hsl(var(--primary) / 0.3) transparent",
              }}
            />

            {/* Bottom bar: icons pinned */}
            <div className="flex items-center justify-between px-2 pb-2">
              {/* Bottom-left icons */}
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      type="button"
                      onClick={handleAttachFile}
                      disabled={!isAuthenticated || isUploading}
                      whileTap={isAuthenticated ? { scale: 0.94 } : undefined}
                      className={cn(
                        "p-2 rounded-lg transition-colors relative",
                        isAuthenticated 
                          ? "text-muted-foreground hover:text-foreground" 
                          : "text-muted-foreground/40 cursor-not-allowed"
                      )}
                    >
                      {isUploading ? (
                        <LoaderIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Paperclip className="w-4 h-4" />
                          {!isAuthenticated && (
                            <Lock className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 text-muted-foreground/60" />
                          )}
                        </>
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {isAuthenticated ? "Attach files" : "Sign in to attach files"}
                  </TooltipContent>
                </Tooltip>
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

              {/* Bottom-right icons */}
              <div className="flex items-center gap-1">
                {/* Plan Button */}
                <DropdownMenu open={showPlanDropdown} onOpenChange={setShowPlanDropdown}>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Plan</span>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-popover border-border z-50">
                    <div className="px-3 py-2 border-b border-border">
                      <span className="text-xs font-semibold text-foreground">Choose your plan</span>
                    </div>
                    <DropdownMenuItem className="gap-2 cursor-pointer px-3 py-2 text-xs">
                      Free
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer px-3 py-2 text-xs">
                      Pro
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer px-3 py-2 text-xs">
                      Enterprise
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Voice Button */}
                <motion.button
                  type="button"
                  onClick={toggleVoiceRecording}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-2 rounded-lg text-sm font-medium transition-all relative",
                    isRecording
                      ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
                      : "text-muted-foreground hover:text-foreground"
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
                    "p-2 rounded-lg text-sm font-medium transition-all",
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
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
