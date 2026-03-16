import React, { useState, useRef, useEffect, useTransition } from "react";
import { Send, Paperclip, Code, Palette, Zap, RefreshCw, X, Mic, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoResizeTextarea } from "../hooks/useAutoResizeTextarea";
import FileUploadZone from "./FileUploadZone";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCredits } from "@/hooks/useGuestCredits";
import { supabase } from "@/integrations/supabase/client";
import { fetchBuild } from "@/services/api";
import { useNavigate } from "react-router-dom";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type CommandSuggestion = {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
};

interface ChatPanelProps {
  selectedStack?: "react" | "nextjs" | "vue" | "html";
  initialPrompt?: string;
  onGeneratedUrl?: (url: string) => void;
  onHealthCheckStatus?: (status: boolean) => void;
  projectId?: string; // If provided, we are modifying an existing project
  selectedElementId?: string; // Add support for targeting specific elements
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
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 44,
    maxHeight: 120,
  });
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
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setValue((prev) => prev + " " + transcript);
      adjustHeight();
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [adjustHeight]);

  useEffect(() => {
    // Only auto-trigger if we have an initial prompt AND we haven't triggered it yet
    if (initialPrompt && initialPrompt.trim() !== "" && !hasAutoTriggered) {
      console.log("ChatPanel: Auto-triggering generation with:", initialPrompt);
      setHasAutoTriggered(true); // Don't trigger again
      startTransition(() => {
        handleSendMessageWithPrompt(initialPrompt);
      });
    }
  }, [initialPrompt]); // Depend on initialPrompt so we see it when it arrives, but block on hasAutoTriggered

  // Pre-signed URL generation and upload logic
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      alert("Please sign in to upload files.");
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`; // Organize by user ID

    try {
      console.log('Uploading file to Supabase Storage...', filePath);
      
      const { data, error } = await supabase.storage
        .from('project_assets') // Ensure this bucket exists in Supabase
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project_assets')
        .getPublicUrl(filePath);

      console.log('Got public URL:', publicUrl);

      // Add the public URL to attachments
      setAttachments(prev => [...prev, publicUrl]);
      
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(`Upload failed: ${error.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Normalizes a URL to ensure it correctly routes through the HTTPS proxy
  // instead of treating raw IP values connecting on HTTP.
  const normalizePreviewUrl = (url: string) => {
    if (url.includes('api.mycodex.dev/preview')) {
        return url; // Already proxied correctly
    }
    // Extract port from raw IP string like "http://178.18.244.175:8514/"
    const match = url.match(/:(\d+)\/?$/);
    if (match && match[1]) {
        return `https://api.mycodex.dev/preview/${match[1]}/`;
    }
    return url;
  };

  // Helper method for the auto-trigger
  const handleSendMessageWithPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    const isModifyMode = !!projectId;
    let currentContainerId = null;

    if (isModifyMode) {
        // Try multiple ways to find the container ID
        // 1. First look in local storage (most reliable post-reload)
        const storedContainers = localStorage.getItem('active_containers');
        if (storedContainers) {
            try {
                const containers = JSON.parse(storedContainers);
                if (containers[projectId]) {
                    currentContainerId = containers[projectId].containerId;
                    console.log("[ChatPanel] Found container from storage:", currentContainerId);
                }
            } catch(e) {}
        }
        
        // 2. Fallback to URL parsing if not in storage
        if (!currentContainerId) {
            const previewIframe = document.querySelector('iframe');
            if (previewIframe && previewIframe.src) {
                const match = previewIframe.src.match(/\/preview\/(\d+)\//);
                if (match) currentContainerId = match[1];
            }
        }
    }

    // Check credits before generating
    const canProceed = isAuthenticated 
      ? (isUnlimited || await authDeductCredit())
      : guestDeductCredit();

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

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: promptText,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);
    setIsModifying(isModifyMode);
    
    // Clear targeted UI element if any
    onClearElement?.();
    
    let fullPrompt = promptText;
    
    // Standardize attachment formats for the backend
    let uploadedImages = [];
    if (attachments.length > 0) {
        // Prepare attachment data in the format expected by the API
        uploadedImages = attachments.map(url => ({ url }));
        // Also append standard textual instructions to ensure model attention
        fullPrompt += `\n\n[USER INSTRUCTION] User uploaded ${attachments.length} image(s). Please incorporate the design elements seen in these images exactly as requested in the main prompt.`;
        console.log("ChatPanel: Sending attachments:", uploadedImages);
    }
    
    // If we have a targeted element, enhance the prompt
    if (selectedElementId && isModifyMode) {
      fullPrompt = `[TARGET: ${selectedElementId}]\n${fullPrompt}`;
      console.log("ChatPanel: Applying targeted fix to", selectedElementId);
    }

    try {
      console.log(`ChatPanel: Sending ${isModifyMode ? 'modify' : 'build'} request for stack:`, selectedStack);
      console.log('Sending full payload to backend...', {
          prompt: fullPrompt,
          isModify: isModifyMode,
          projectId: projectId,
          stack: selectedStack,
          images: uploadedImages
      });
      
      const API_URL = "https://api.mycodex.dev";
      const endpoint = isModifyMode ? `${API_URL}/modify` : `${API_URL}/build`;
      
      const requestBody = {
          prompt: fullPrompt,
          stack: selectedStack,
          ...(isModifyMode && { 
              projectId,
              containerId: currentContainerId // Important: Pass the container back so it gets reused 
          }),
          ...(uploadedImages.length > 0 && { images: uploadedImages })
      };
      
      const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
      });

      console.log("ChatPanel: API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("ChatPanel: API Error Text:", errorText);
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log("ChatPanel: API response data:", data);

      if (data.success && data.url) {
        // Use normalized URL to prevent HTTP connection blocks
        const previewUrl = normalizePreviewUrl(data.url);
        onGeneratedUrl?.(previewUrl);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: `🚀 Your app is ${isModifyMode ? 'modified' : 'ready'}!\n\nURL: ${previewUrl}`,
          },
        ]);

        // Keep polling simplified since backend proxy handles visibility better
        markAsReady(previewUrl);
      } else {
        throw new Error(data.error || "Failed to generate application");
      }
    } catch (error: any) {
      console.error("ChatPanel: Generate error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `⚠️ Backend Error: ${error.message || "Failed to connect to the generator API."}`
        },
      ]);
      // Attempt to notify health check if available
      onHealthCheckStatus?.(false);
    } finally {
      setIsTyping(false);
      setIsModifying(false);
    }
  };

  const markAsReady = async (previewUrl: string) => {
    console.log("markAsReady: Verifying...", previewUrl);
    try {
        // Just execute a single fetch to ensure the proxy route is warm
        await fetch(previewUrl, { method: "HEAD", mode: "no-cors" });
    } catch(e) {
        // Ignore errors, iframe will handle it via HTTP proxy anyway
    }
    
    // Hard refresh navigation via window logic ensures 100% clean state
    if (window.location.pathname === '/' || window.location.pathname === '') {
        console.log("Redirecting to preview page with URL:", previewUrl);
        navigate(`/preview?url=${encodeURIComponent(previewUrl)}`, { replace: true });
    }
  };

  const triggerBuild = async (prompt: string, selectedStack: "react" | "nextjs" | "vue" | "html") => {
    let canProceed = false;

    if (isAuthenticated) {
      if (isUnlimited) {
        canProceed = true; // Pro users always proceed
      } else {
        canProceed = await authDeductCredit(); // Wait for actual DB debit
      }
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
          const previewUrl = normalizePreviewUrl(data.url);
          onGeneratedUrl?.(previewUrl);
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              role: "assistant",
              content: `🚀 Your app is ready!\n\nURL: ${previewUrl}`,
            },
          ]);

          // Mark as ready immediately - no more polling
          markAsReady(previewUrl);
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
          : `⚠️ Backend Error: ${result.error || "Please check your connection and try again."}`;

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

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: value,
      };

      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(true);
      setIsModifying(isModifyMode);
      setValue("");
      setAttachments([]);
      adjustHeight(true);
      
      // Clear targeted UI element if any
      onClearElement?.();

      let fullPrompt = value;
      
      // Standardize attachment formats for the backend
      let uploadedImages = [];
      if (attachments.length > 0) {
          uploadedImages = attachments.map(url => ({ url }));
          fullPrompt += `\n\n[USER INSTRUCTION] User uploaded ${attachments.length} image(s). Please incorporate the design elements seen in these images exactly as requested in the main prompt.`;
      }
      
      // If we have a targeted element, enhance the prompt
      if (selectedElementId && isModifyMode) {
        fullPrompt = `[TARGET: ${selectedElementId}]\n${fullPrompt}`;
        console.log("ChatPanel: Applying targeted fix to", selectedElementId);
      }

      try {
        const API_URL = "https://api.mycodex.dev";
        const endpoint = isModifyMode ? `${API_URL}/modify` : `${API_URL}/build`;
        
        let currentContainerId = null;
        if (isModifyMode) {
            const storedContainers = localStorage.getItem('active_containers');
            if (storedContainers) {
                try {
                    const containers = JSON.parse(storedContainers);
                    if (containers[projectId]) {
                        currentContainerId = containers[projectId].containerId;
                    }
                } catch(e) {}
            }
        }

        const requestBody = {
            prompt: fullPrompt,
            stack: selectedStack,
            ...(isModifyMode && { 
                projectId,
                containerId: currentContainerId
            }),
            ...(uploadedImages.length > 0 && { images: uploadedImages })
        };
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.url) {
          const previewUrl = normalizePreviewUrl(data.url);
          onGeneratedUrl?.(previewUrl);
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              role: "assistant",
              content: `🚀 Your app is ${isModifyMode ? 'modified' : 'ready'}!\n\nURL: ${previewUrl}`,
            },
          ]);

          markAsReady(previewUrl);
        } else {
          throw new Error(data.error || "Failed to generate application");
        }
      } catch (error: any) {
        console.error("ChatPanel Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: `⚠️ Backend Error: ${error.message || "Failed to connect to the generator API."}`
          },
        ]);
        onHealthCheckStatus?.(false);
      } finally {
        setIsTyping(false);
        setIsModifying(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-xl relative">
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
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-4"
                  : "bg-muted/50 border border-white/5 mr-4"
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-muted/50 border border-white/5 rounded-2xl p-4 shadow-lg flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-.3s]" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-.5s]" />
                </div>
              </div>
              
              {/* Contextual loading messages */}
              <div className="text-xs font-mono text-primary/80 bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
                {isModifying 
                  ? "Applying modifications and updating application..." 
                  : "Building application architecture from prompt..."}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showUpgradePrompt && !isAuthenticated && (
        <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center justify-between">
          <p className="text-sm text-primary">Sign in to save projects and get more credits!</p>
          <button 
            onClick={() => navigate('/login')}
            className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      {showUpgradePrompt && isAuthenticated && (
        <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center justify-between">
          <p className="text-sm text-primary">Upgrade your plan to get more daily credits!</p>
          <button 
            onClick={() => navigate('/pricing')}
            className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      <div className="p-4 border-t border-white/5 bg-background/80 backdrop-blur-xl shrink-0">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            {isUnlimited ? 'Unlimited' : `${currentCredits} left`}
          </span>
          {!hasCredits && (
            <span className="text-xs font-medium text-destructive animate-pulse">
              Limit reached
            </span>
          )}
        </div>
        
        {/* Selected Element Pill Indicator */}
        {selectedElementId && (
          <motion.div 
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            className="mb-3 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-sm text-primary">
              <PlusSquare className="w-4 h-4" />
              <span>Targeting: <strong className="font-mono">{selectedElementId}</strong></span>
            </div>
            <button 
              onClick={onClearElement}
              className="p-1 hover:bg-primary/20 rounded-md transition-colors text-primary border border-transparent hover:border-primary/30"
              title="Clear target selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <AnimatePresence>
              {attachments.map((url, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <img
                    src={url}
                    alt={`Attachment ${i + 1}`}
                    className="h-16 w-16 object-cover rounded-lg border border-white/10"
                  />
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

        <div className="relative flex items-end gap-2 bg-muted/30 border border-white/10 rounded-2xl p-2 focus-within:border-primary/50 transition-colors shadow-inner">
          {showCommandPalette && (
            <div
              ref={commandPaletteRef}
              className="absolute bottom-full left-0 w-64 mb-2 bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 transform origin-bottom"
            >
              <div className="p-2 border-b border-white/5 bg-muted/30">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick commands
                </span>
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
                      index === activeSuggestion
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${
                      index === activeSuggestion ? "bg-white/20" : "bg-background/50"
                    }`}>
                      {suggestion.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {suggestion.label}
                      </span>
                      <span className={`text-xs ${
                        index === activeSuggestion ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}>
                        {suggestion.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-1 pb-1 px-1">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || attachments.length >= 3}
              className={`p-2 text-muted-foreground hover:text-foreground rounded-xl transition-colors ${
                isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"
              }`}
              title="Attach image (max 3)"
            >
              <FileUploadZone onFileSelect={(file) => {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                if (fileInputRef.current) {
                  fileInputRef.current.files = dataTransfer.files;
                  handleFileUpload({ target: fileInputRef.current } as any);
                }
              }}>
                {isUploading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Paperclip className="w-5 h-5" />
                )}
              </FileUploadZone>
            </button>
            <button
              onClick={toggleVoiceRecording}
              className={`p-2 rounded-xl transition-all shadow-sm ${
                isRecording
                  ? "bg-destructive text-destructive-foreground animate-pulse shadow-destructive/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

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
                  ? `Modifying target element...`
                  : isModifying 
                    ? `Modify project...` 
                    : "Describe your app..."
            }
            className="flex-1 bg-transparent border-none resize-none focus:ring-0 py-3 px-2 text-sm max-h-[120px] scrollbar-thin scrollbar-thumb-white/10"
            rows={1}
            disabled={!hasCredits}
          />

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
