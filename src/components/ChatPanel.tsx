import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, ChevronDown, Paperclip, PencilLine, Settings, Trash2, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCredits } from "@/hooks/useCredits";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
}: ChatPanelProps) => {
  const navigate = useNavigate();
  const { user, profile, userCredits, deductCredit: authDeductCredit } = useAuth();
  const { credits: guestCredits, deductCredit: guestDeductCredit } = useGuestCredits();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projectName, setProjectName] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 144), 220)}px`;
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

      const { data } = await supabase.from("projects").select("name").eq("id", projectId).maybeSingle();

      if (!ignore) {
        setProjectName(data?.name?.trim() || null);
      }
    };

    void loadProjectName();

    return () => {
      ignore = true;
    };
  }, [projectId]);

  const handleRenameProject = async () => {
    const nextName = window.prompt("Rename project", displayProjectName)?.trim();
    if (!nextName) return;

    setProjectName(nextName);

    if (!projectId) return;

    const { error } = await supabase.from("projects").update({ name: nextName }).eq("id", projectId);

    if (error) {
      console.error("[EditPanel] Rename failed", error);
      setInlineError("Could not rename project.");
    }
  };

  const handleDeleteProject = async () => {
    const confirmed = window.confirm("Delete this project? This action cannot be undone.");
    if (!confirmed) return;

    if (projectId) {
      const { error } = await supabase.from("projects").delete().eq("id", projectId);

      if (error) {
        console.error("[EditPanel] Delete failed", error);
        setInlineError("Could not delete project.");
        return;
      }

      const storedContainers = localStorage.getItem("active_containers");
      if (storedContainers) {
        try {
          const parsed = JSON.parse(storedContainers);
          delete parsed[projectId];
          localStorage.setItem("active_containers", JSON.stringify(parsed));
        } catch (error) {
          console.error("[EditPanel] Failed to clear local container cache", error);
        }
      }
    }

    navigate("/projects");
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
      <div className="border-b border-border/80 bg-card/40 px-5 py-4 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Project
            </p>
            <div className="truncate text-base font-semibold tracking-tight text-foreground">
              {displayProjectName}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl border-border/80 bg-card/70 px-3 text-muted-foreground hover:bg-accent/10 hover:text-foreground"
              >
                <span className="text-sm">Menu</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/80 bg-popover/95 p-1.5 backdrop-blur-md">
              <DropdownMenuItem
                onClick={() => navigate(isAuthenticated ? "/pricing" : "/login")}
                className="rounded-lg px-3 py-2"
              >
                <Wallet className="mr-2 h-4 w-4" />
                <span>Credits</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {isUnlimited ? "Unlimited" : currentCredits}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile")} className="rounded-lg px-3 py-2">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void handleRenameProject()} className="rounded-lg px-3 py-2">
                <PencilLine className="mr-2 h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/80" />
              <DropdownMenuItem
                onClick={() => void handleDeleteProject()}
                className="rounded-lg px-3 py-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 px-5 py-5">
        <div className="h-full rounded-[28px] border border-dashed border-border/50 bg-card/10" />
      </div>

      <div className="px-4 pb-4 pt-0">
        <div className="rounded-[26px] border border-border/80 bg-card/75 p-3 shadow-[0_18px_40px_hsl(var(--primary)/0.12)] backdrop-blur-xl">
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
            rows={4}
            className="min-h-[144px] max-h-[220px] w-full resize-none overflow-y-auto bg-transparent px-1 py-1 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground"
          />

          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2 px-1">
              {attachments.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="overflow-hidden rounded-lg border border-border/80 bg-background/70"
                >
                  <img src={url} alt={`Attachment ${index + 1}`} className="h-12 w-12 object-cover" />
                </div>
              ))}
            </div>
          )}

          {(inlineError || showUpgradePrompt) && (
            <div className="px-1 pb-3 text-xs text-destructive">{inlineError}</div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-border/70 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-10 rounded-xl border-border/80 bg-background/70 px-3 text-muted-foreground hover:bg-accent/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Paperclip className="h-4 w-4" />
              <span>Attach</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => void handleSend()}
              disabled={!value.trim() || isSubmitting || !hasCredits}
              className={cn(
                "h-10 rounded-xl px-4 shadow-[0_0_24px_hsl(var(--primary)/0.25)]",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <span>{isSubmitting ? "Generating..." : "Generate"}</span>
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
