import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, MessageSquareText, Mic, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { startTranscription } from "@/services/speechTranscription";

const API_URL = "https://api.mycodex.dev";

interface ChatPanelProps {
  selectedStack?: string;
  initialPrompt?: string;
  onGeneratedUrl?: (url: string) => void;
  onHealthCheckStatus?: (status: boolean) => void;
  projectId?: string;
  selectedElementId?: string;
  onClearElement?: () => void;
}

const deriveProjectName = (input?: string) => {
  const text = input?.trim();
  if (!text) return "";

  const namedMatch = text.match(/(?:for|called|named)\s+([A-Za-z0-9][A-Za-z0-9\s&'’-]{1,50})/i);
  if (namedMatch?.[1]) return namedMatch[1].trim();

  return text
    .replace(/^(build|create|make|generate)\s+/i, "")
    .replace(/^(a|an)\s+/i, "")
    .replace(/[.?!]+$/, "")
    .slice(0, 48)
    .trim();
};

const normalizePreviewUrl = (url: string) => {
  if (url.includes("api.mycodex.dev/preview")) return url;
  const match = url.match(/:(\d+)\/?$/);
  if (match?.[1]) return `https://api.mycodex.dev/preview/${match[1]}/`;
  return url;
};

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
  const { credits: guestCredits, deductCredit: guestDeductCredit } = useGuestCredits();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transcriptionSessionRef = useRef<{ stop: () => void } | null>(null);
  const transcriptionBaseRef = useRef("");

  const [projectName, setProjectName] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);
  const [inlineError, setInlineError] = useState("");

  const isAuthenticated = !!user;
  const isUnlimited = profile?.plan === "pro" || profile?.plan === "enterprise";
  const currentCredits = isAuthenticated ? (userCredits?.credits_remaining ?? 0) : guestCredits;
  const hasCredits = isUnlimited || currentCredits > 0;

  const displayProjectName = useMemo(() => {
    return projectName || deriveProjectName(initialPrompt) || "Untitled Project";
  }, [projectName, initialPrompt]);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  useEffect(() => {
    let ignore = false;

    const loadProjectName = async () => {
      if (!projectId) {
        setProjectName(null);
        return;
      }

      const { data } = await supabase
        .from("projects")
        .select("name")
        .eq("id", projectId)
        .maybeSingle();

      if (!ignore) {
        setProjectName(data?.name?.trim() || null);
      }
    };

    void loadProjectName();

    return () => {
      ignore = true;
    };
  }, [projectId]);

  useEffect(() => {
    return () => {
      transcriptionSessionRef.current?.stop();
    };
  }, []);

  const stopRecording = () => {
    const session = transcriptionSessionRef.current;
    transcriptionSessionRef.current = null;
    session?.stop();
    setIsRecording(false);
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      console.log("[EditPanel] Voice input stopped");
      stopRecording();
      return;
    }

    transcriptionBaseRef.current = value.trim();
    setInlineError("");
    setIsRecording(true);

    try {
      const session = await startTranscription({
        silenceTimeout: 2500,
        chunkInterval: 150,
        onInterim: (text) => {
          console.log("[EditPanel] Interim transcript received", text);
          const nextValue = [transcriptionBaseRef.current, text].filter(Boolean).join(" ").trim();
          setValue(nextValue);
        },
        onFinal: (text) => {
          console.log("[EditPanel] Final transcript received", text);
          const nextValue = [transcriptionBaseRef.current, text].filter(Boolean).join(" ").trim();
          setValue(nextValue);
        },
        onError: (message) => {
          console.error("[EditPanel] Voice input error", message);
          setInlineError(message);
          transcriptionSessionRef.current = null;
          setIsRecording(false);
        },
        onStatusChange: (status) => {
          console.log("[EditPanel] Voice input status", status);
          if (status === "stopped") {
            transcriptionSessionRef.current = null;
            setIsRecording(false);
          }
        },
      });

      transcriptionSessionRef.current = session;
      console.log("[EditPanel] Recording started");
    } catch (error) {
      console.error("[EditPanel] Voice input failed to start", error);
      setInlineError("Voice input failed. Please try again.");
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      setInlineError("Please sign in to attach files.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    setInlineError("");

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${Math.random().toString(36).slice(2)}.${fileExt}`;

    try {
      const { error } = await supabase.storage.from("project_assets").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("project_assets").getPublicUrl(filePath);

      setAttachments((prev) => [...prev, publicUrl]);
    } catch (error: any) {
      console.error("[EditPanel] File upload failed", error);
      setInlineError(error.message || "Failed to attach file.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const requestCredit = async () => {
    if (isAuthenticated) {
      return isUnlimited || (await authDeductCredit());
    }

    return guestDeductCredit();
  };

  const submitPrompt = async (promptText: string) => {
    if (!promptText.trim() || isSubmitting) return;

    setInlineError("");
    const canProceed = await requestCredit();

    if (!canProceed) {
      setShowUpgradePrompt(true);
      setInlineError(
        isAuthenticated
          ? "You’ve reached today’s limit. Upgrade to continue editing."
          : "Please sign in to continue editing this project."
      );
      return;
    }

    setShowUpgradePrompt(false);
    setIsSubmitting(true);

    const isModifyMode = !!projectId;
    let fullPrompt = promptText.trim();
    const uploadedImages = attachments.map((url) => ({ url }));

    if (uploadedImages.length > 0) {
      fullPrompt += `\n\n[USER INSTRUCTION] User uploaded ${uploadedImages.length} image(s). Please incorporate the design elements seen in these images exactly as requested in the main prompt.`;
    }

    if (selectedElementId && isModifyMode) {
      fullPrompt = `[TARGET: ${selectedElementId}]\n${fullPrompt}`;
    }

    try {
      const endpoint = isModifyMode ? `${API_URL}/modify` : `${API_URL}/build`;
      let currentContainerId: string | null = null;

      if (isModifyMode) {
        const storedContainers = localStorage.getItem("active_containers");
        if (storedContainers) {
          try {
            const parsed = JSON.parse(storedContainers);
            currentContainerId = parsed?.[projectId!]?.containerId ?? null;
          } catch {
            currentContainerId = null;
          }
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullPrompt,
          stack: selectedStack,
          ...(isModifyMode && { projectId, containerId: currentContainerId }),
          ...(uploadedImages.length > 0 && { images: uploadedImages }),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (!data.success || !data.url) {
        throw new Error(data.error || "Failed to update project");
      }

      const previewUrl = normalizePreviewUrl(data.url);
      onGeneratedUrl?.(previewUrl);
      onHealthCheckStatus?.(true);
      setValue("");
      setAttachments([]);
    } catch (error: any) {
      console.error("[EditPanel] Submit failed", error);
      onHealthCheckStatus?.(false);
      setInlineError(error.message || "Something went wrong while updating the project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!initialPrompt.trim() || hasAutoTriggered) return;
    setHasAutoTriggered(true);
    void submitPrompt(initialPrompt);
  }, [hasAutoTriggered, initialPrompt]);

  const handleSend = async () => {
    await submitPrompt(value);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border px-5 py-5">
        <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
          {displayProjectName}
        </h1>
      </div>

      <div className="flex-1" />

      <div className="border-t border-border bg-background px-4 py-4">
        {showUpgradePrompt && (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            <span>
              {isAuthenticated ? "Upgrade for more edits." : "Sign in to continue editing."}
            </span>
            <button
              onClick={() => navigate(isAuthenticated ? "/pricing" : "/login")}
              className="text-primary transition-colors hover:text-primary/80"
            >
              {isAuthenticated ? "Upgrade" : "Sign in"}
            </button>
          </div>
        )}

        {selectedElementId && (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            <span className="truncate">Editing target: {selectedElementId}</span>
            <button onClick={onClearElement} className="text-primary transition-colors hover:text-primary/80">
              Clear
            </button>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((url, index) => (
              <div key={`${url}-${index}`} className="relative overflow-hidden rounded-xl border border-border bg-card">
                <img src={url} alt={`Attachment ${index + 1}`} className="h-14 w-14 object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="rounded-[24px] border border-border bg-card/80 p-3 shadow-lg shadow-primary/10">
          <input
            ref={fileInputRef}
            type="file"
            multiple={false}
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setInlineError("");
            }}
            placeholder="Type changes"
            rows={3}
            className="min-h-[120px] w-full resize-none bg-transparent px-1 py-1 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground"
          />

          {inlineError && (
            <div className="px-1 pb-2 text-xs text-destructive">{inlineError}</div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                title="Attach"
              >
                <Plus className="h-4 w-4" />
              </button>

              <button
                onClick={() => textareaRef.current?.focus()}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm text-foreground transition-colors hover:text-primary"
                title="Visual edits"
              >
                <Sparkles className="h-4 w-4" />
                <span>Visual edits</span>
              </button>

              <button
                onClick={() => textareaRef.current?.focus()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
                title="Comments"
              >
                <MessageSquareText className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoiceRecording}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background transition-colors",
                  isRecording ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>

              <button
                onClick={() => void handleSend()}
                disabled={!value.trim() || isSubmitting || !hasCredits}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                title="Send"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
