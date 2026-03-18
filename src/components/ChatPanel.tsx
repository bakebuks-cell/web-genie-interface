import React, { useState, useRef, useEffect, useTransition } from "react";
import { Send, Paperclip, Code, Palette, Zap, RefreshCw, X, Mic, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// === EMBEDDED: useAutoResizeTextarea (missing from repo) ===
function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = (reset?: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (reset) { textarea.style.height = `${minHeight}px`; return; }
    textarea.style.height = `${minHeight}px`;
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  };
  return { textareaRef, adjustHeight };
}

// === EMBEDDED: FileUploadZone (missing from repo) ===
const FileUploadZone: React.FC<{ onFileSelect: (file: File) => void; children: React.ReactNode }> = ({ onFileSelect, children }) => {
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) onFileSelect(e.dataTransfer.files[0]);
  };
  return <div onDragOver={handleDragOver} onDrop={handleDrop} className="inline-flex items-center justify-center">{children}</div>;
};

// === EMBEDDED: fetchBuild (missing from repo as @/services/api) ===
const API_URL = "https://api.mycodex.dev";

async function fetchBuild(prompt: string, stack: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 min timeout
    const response = await fetch(`${API_URL}/build`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, stack }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      return { success: false, error: `Server returned ${response.status}` };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    if (error.name === "AbortError") {
      return { success: false, error: "timeout" };
    }
    return { success: false, error: error.message || "Network error" };
  }
}

// === TYPES ===
type Message = { id: string; role: "user" | "assistant"; content: string };
type CommandSuggestion = { icon: React.ReactNode; label: string; description: string; prefix: string };

interface ChatPanelProps {
  selectedStack?: "react" | "nextjs" | "vue" | "html";
  initialPrompt?: string;
  onGeneratedUrl?: (url: string) => void;
  onHealthCheckStatus?: (status: boolean) => void;
  projectId?: string;
  selectedElementId?: string;
  onClearElement?: () => void;
}

// === MAIN COMPONENT ===
const ChatPanel = ({
  selectedStack = "react",
  initialPrompt = "",
  onGeneratedUrl,
  onHealthCheckStatus,
  projectId,
  selectedElementId,
  onClearElement,
}: ChatPanelProps) => {
  const navigate = useNavigate();
  const { user, profile, userCredits, deductCredit: authDeductCredit } = useAuth();
  const { credits: guestCredits, hasCredits: guestHasCredits, deductCredit: guestDeductCredit } = useGuestCredits();

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "I'm ready to generate your application. Describe what you want to build!" },
  ]);
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 44, maxHeight: 120 });
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isAuthenticated = !!user;
  const isUnlimited = profile?.plan === "pro" || profile?.plan === "enterprise";
  const currentCredits = isAuthenticated ? (userCredits?.credits_remaining ?? 0) : guestCredits;
  const hasCredits = isUnlimited || currentCredits > 0;

  const commandSuggestions: CommandSuggestion[] = [
    { icon: <Code className="w-4 h-4" />, label: "Add Feature", description: "Add a new feature to your app", prefix: "/feature" },
    { icon: <Palette className="w-4 h-4" />, label: "Change Style", description: "Modify colors, fonts, or layout", prefix: "/style" },
    { icon: <Zap className="w-4 h-4" />, label: "Optimize", description: "Improve performance or code quality", prefix: "/optimize" },
    { icon: <RefreshCw className="w-4 h-4" />, label: "Refactor", description: "Restructure existing code", prefix: "/refactor" },
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
      const idx = commandSuggestions.findIndex((cmd) => cmd.prefix.startsWith(value));
      setActiveSuggestion(idx >= 0 ? idx : -1);
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.onresult = (event: any) => {
      setValue((prev) => prev + " " + event.results[0][0].transcript);
      adjustHeight();
    };
    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.onerror = () => setIsRecording(false);
    return () => {
      recognitionRef.current?.stop();
    };
  }, [adjustHeight]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== "" && !hasAutoTriggered) {
      setHasAutoTriggered(true);
      startTransition(() => {
        handleSendMessageWithPrompt(initialPrompt);
      });
    }
  }, [initialPrompt]);

  // === FILE UPLOAD ===
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) {
      alert("Please sign in to upload files.");
      return;
    }
    setIsUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    try {
      const { data, error } = await supabase.storage.from("project_assets").upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("project_assets").getPublicUrl(filePath);
      setAttachments((prev) => [...prev, publicUrl]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      alert(`Upload failed: ${error.message || "Unknown error"}.`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // === URL NORMALIZER ===
  const normalizePreviewUrl = (url: string) => {
    if (url.includes("api.mycodex.dev/preview")) return url;
    const match = url.match(/:(\d+)\/?$/);
    if (match && match[1]) return `https://api.mycodex.dev/preview/${match[1]}/`;
    return url;
  };

  // === SEND WITH PROMPT (auto-trigger) ===
  const handleSendMessageWithPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;
    const isModifyMode = !!projectId;
    let currentContainerId: string | null = null;
    if (isModifyMode) {
      const sc = localStorage.getItem("active_containers");
      if (sc) {
        try {
          const c = JSON.parse(sc);
          if (c[projectId!]) currentContainerId = c[projectId!].containerId;
        } catch (e) {}
      }
      if (!currentContainerId) {
        const iframe = document.querySelector("iframe");
        if (iframe && (iframe as HTMLIFrameElement).src) {
          const m = (iframe as HTMLIFrameElement).src.match(/\/preview\/(\d+)\//);
          if (m) currentContainerId = m[1];
        }
      }
    }
    const canProceed = isAuthenticated ? isUnlimited || (await authDeductCredit()) : guestDeductCredit();
    if (!canProceed) {
      setShowUpgradePrompt(!isAuthenticated);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: !isAuthenticated
            ? "You've run out of guest credits. Please sign in to continue building!"
            : "You've run out of credits for today. Upgrade your plan to continue building!",
        },
      ]);
      return;
    }
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: promptText }]);
    setIsTyping(true);
    setIsModifying(isModifyMode);
    onClearElement?.();

    let fullPrompt = promptText;
    let uploadedImages: { url: string }[] = [];
    if (attachments.length > 0) {
      uploadedImages = attachments.map((url) => ({ url }));
      fullPrompt += `\n\n[USER INSTRUCTION] User uploaded ${attachments.length} image(s). Please incorporate the design elements seen in these images exactly as requested in the main prompt.`;
    }
    if (selectedElementId && isModifyMode) {
      fullPrompt = `[TARGET: ${selectedElementId}]\n${fullPrompt}`;
    }

    try {
      const endpoint = isModifyMode ? `${API_URL}/modify` : `${API_URL}/build`;
      const requestBody = {
        prompt: fullPrompt,
        stack: selectedStack,
        ...(isModifyMode && { projectId, containerId: currentContainerId }),
        ...(uploadedImages.length > 0 && { images: uploadedImages }),
      };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      if (data.success && data.url) {
        const previewUrl = normalizePreviewUrl(data.url);
        onGeneratedUrl?.(previewUrl);
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 2).toString(), role: "assistant", content: `🚀 Your app is ${isModifyMode ? "modified" : "ready"}!\n\nURL: ${previewUrl}` },
        ]);
        markAsReady(previewUrl);
      } else {
        throw new Error(data.error || "Failed to generate application");
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), role: "assistant", content: `⚠️ Backend Error: ${error.message || "Failed to connect to the generator API."}` },
      ]);
      onHealthCheckStatus?.(false);
    } finally {
      setIsTyping(false);
      setIsModifying(false);
    }
  };

  // === MARK AS READY ===
  const markAsReady = async (previewUrl: string) => {
    try {
      await fetch(previewUrl, { method: "HEAD", mode: "no-cors" });
    } catch (e) {}
    if (window.location.pathname === "/" || window.location.pathname === "") {
      navigate(`/preview?url=${encodeURIComponent(previewUrl)}`, { replace: true });
    }
  };

  // === TRIGGER BUILD (uses embedded fetchBuild) ===
  const triggerBuild = async (prompt: string, buildStack: "react" | "nextjs" | "vue" | "html") => {
    let canProceed = false;
    if (isAuthenticated) {
      canProceed = isUnlimited || (await authDeductCredit());
    } else {
      canProceed = guestDeductCredit();
    }
    if (!canProceed) {
      setShowUpgradePrompt(!isAuthenticated);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: "You've run out of credits for today. Sign in or upgrade to continue building!" },
      ]);
      return;
    }
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: prompt }]);
    setIsTyping(true);
    setValue("");
    setAttachments([]);
    adjustHeight(true);
    try {
      const result = await fetchBuild(prompt, buildStack);
      if (result.success && result.data) {
        const data = result.data;
        if (data.success && data.url) {
          const previewUrl = normalizePreviewUrl(data.url);
          onGeneratedUrl?.(previewUrl);
          setMessages((prev) => [
            ...prev,
            { id: (Date.now() + 2).toString(), role: "assistant", content: `🚀 Your app is ready!\n\nURL: ${previewUrl}` },
          ]);
          markAsReady(previewUrl);
        } else {
          setMessages((prev) => [
            ...prev,
            { id: (Date.now() + 2).toString(), role: "assistant", content: data.response || data.message || "I'll make those changes for you. Updating the application now..." },
          ]);
        }
      } else {
        const errorMessage =
          result.error === "timeout"
            ? "The request timed out after 10 minutes. Please try again."
            : `⚠️ Backend Error: ${result.error || "Please check your connection and try again."}`;
        setMessages((prev) => [...prev, { id: (Date.now() + 2).toString(), role: "assistant", content: errorMessage }]);
      }
    } catch (error: any) {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "An unexpected error occurred. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // === VOICE ===
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

  // === KEYBOARD ===
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) => (prev < commandSuggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : commandSuggestions.length - 1));
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          setValue(commandSuggestions[activeSuggestion].prefix + " ");
          setShowCommandPalette(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) handleSendMessage();
    }
  };

  // === SEND MESSAGE (manual) ===
  const handleSendMessage = async () => {
    if (!value.trim()) return;
    const isModifyMode = !!projectId;
    let canProceed = false;
    if (isAuthenticated) {
      canProceed = isUnlimited || (await authDeductCredit());
    } else {
      canProceed = guestDeductCredit();
    }
    if (!canProceed) {
      setShowUpgradePrompt(!isAuthenticated);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: !isAuthenticated
            ? "You've run out of guest credits. Please sign in to continue building!"
            : "You've run out of credits for today. Upgrade your plan to continue building!",
        },
      ]);
      return;
    }
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: value }]);
    setIsTyping(true);
    setIsModifying(isModifyMode);
    const currentValue = value;
    setValue("");
    setAttachments([]);
    adjustHeight(true);
    onClearElement?.();

    let fullPrompt = currentValue;
    let uploadedImages: { url: string }[] = [];
    if (attachments.length > 0) {
      uploadedImages = attachments.map((url) => ({ url }));
      fullPrompt += `\n\n[USER INSTRUCTION] User uploaded ${attachments.length} image(s). Please incorporate the design elements seen in these images exactly as requested in the main prompt.`;
    }
    if (selectedElementId && isModifyMode) {
      fullPrompt = `[TARGET: ${selectedElementId}]\n${fullPrompt}`;
    }

    try {
      const endpoint = isModifyMode ? `${API_URL}/modify` : `${API_URL}/build`;
      let currentContainerId: string | null = null;
      if (isModifyMode) {
        const sc = localStorage.getItem("active_containers");
        if (sc) {
          try {
            const c = JSON.parse(sc);
            if (c[projectId!]) currentContainerId = c[projectId!].containerId;
          } catch (e) {}
        }
      }
      const requestBody = {
        prompt: fullPrompt,
        stack: selectedStack,
        ...(isModifyMode && { projectId, containerId: currentContainerId }),
        ...(uploadedImages.length > 0 && { images: uploadedImages }),
      };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      if (data.success && data.url) {
        const previewUrl = normalizePreviewUrl(data.url);
        onGeneratedUrl?.(previewUrl);
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 2).toString(), role: "assistant", content: `🚀 Your app is ${isModifyMode ? "modified" : "ready"}!\n\nURL: ${previewUrl}` },
        ]);
        markAsReady(previewUrl);
      } else {
        throw new Error(data.error || "Failed to generate application");
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), role: "assistant", content: `⚠️ Backend Error: ${error.message || "Failed to connect to the generator API."}` },
      ]);
      onHealthCheckStatus?.(false);
    } finally {
      setIsTyping(false);
      setIsModifying(false);
    }
  };

  // === RENDER ===
  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-xl relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.role === "user" ? "bg-primary text-primary-foreground ml-4" : "bg-muted/50 border border-white/5 mr-4"
              } shadow-lg backdrop-blur-sm`}
            >
              <div className="prose prose-sm dark:prose-invert">
                {message.content.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-2" : ""}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="bg-muted/50 border border-white/5 rounded-2xl p-4 shadow-lg flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-.3s]" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-.5s]" />
                </div>
              </div>
              <div className="text-xs font-mono text-primary/80 bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
                {isModifying ? "Applying modifications and updating application..." : "Building application architecture from prompt..."}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Upgrade Prompts */}
      {showUpgradePrompt && !isAuthenticated && (
        <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center justify-between">
          <p className="text-sm text-primary">Sign in to save projects and get more credits!</p>
          <button onClick={() => navigate("/login")} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
            Sign In
          </button>
        </div>
      )}
      {showUpgradePrompt && isAuthenticated && (
        <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center justify-between">
          <p className="text-sm text-primary">Upgrade your plan to get more daily credits!</p>
          <button onClick={() => navigate("/pricing")} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-background/80 backdrop-blur-xl shrink-0">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            {isUnlimited ? "Unlimited" : `${currentCredits} left`}
          </span>
          {!hasCredits && <span className="text-xs font-medium text-destructive animate-pulse">Limit reached</span>}
        </div>

        {/* Selected Element Pill */}
        {selectedElementId && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            className="mb-3 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-sm text-primary">
              <PlusSquare className="w-4 h-4" />
              <span>
                Targeting: <strong className="font-mono">{selectedElementId}</strong>
              </span>
            </div>
            <button onClick={onClearElement} className="p-1 hover:bg-primary/20 rounded-md transition-colors text-primary" title="Clear target selection">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <AnimatePresence>
              {attachments.map((url, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative group">
                  <img src={url} alt={`Attachment ${i + 1}`} className="h-16 w-16 object-cover rounded-lg border border-white/10" />
                  <button
                    onClick={() => removeAttachment(i)}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Input Box */}
        <div className="relative flex items-end gap-2 bg-muted/30 border border-white/10 rounded-2xl p-2 focus-within:border-primary/50 transition-colors shadow-inner">
          {/* Command Palette */}
          {showCommandPalette && (
            <div
              ref={commandPaletteRef}
              className="absolute bottom-full left-0 w-64 mb-2 bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 transform origin-bottom"
            >
              <div className="p-2 border-b border-white/5 bg-muted/30">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick commands</span>
              </div>
              <div className="p-1">
                {commandSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.prefix}
                    onClick={() => {
                      setValue(suggestion.prefix + " ");
                      setShowCommandPalette(false);
                      textareaRef.current?.focus();
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${
                      index === activeSuggestion ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${index === activeSuggestion ? "bg-white/20" : "bg-background/50"}`}>{suggestion.icon}</div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{suggestion.label}</span>
                      <span className={`text-xs ${index === activeSuggestion ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{suggestion.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-1 pb-1 px-1">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || attachments.length >= 3}
              className={`p-2 text-muted-foreground hover:text-foreground rounded-xl transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"}`}
              title="Attach image (max 3)"
            >
              <FileUploadZone
                onFileSelect={(file) => {
                  const dt = new DataTransfer();
                  dt.items.add(file);
                  if (fileInputRef.current) {
                    fileInputRef.current.files = dt.files;
                    handleFileUpload({ target: fileInputRef.current } as any);
                  }
                }}
              >
                {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
              </FileUploadZone>
            </button>
            <button
              onClick={toggleVoiceRecording}
              className={`p-2 rounded-xl transition-all shadow-sm ${
                isRecording ? "bg-destructive text-destructive-foreground animate-pulse shadow-destructive/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              !hasCredits
                ? "Out of credits"
                : isModifying && selectedElementId
                ? "Modifying target element..."
                : isModifying
                ? "Modify project..."
                : "Describe your app..."
            }
            className="flex-1 bg-transparent border-none resize-none focus:ring-0 py-3 px-2 text-sm max-h-[120px] scrollbar-thin scrollbar-thumb-white/10"
            rows={1}
            disabled={!hasCredits}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!value.trim() || isPending || !hasCredits}
            className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 mb-1 mr-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
