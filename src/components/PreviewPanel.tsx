import { useState, useEffect, useRef, useCallback } from "react";
import { ExternalLink, RefreshCw, MousePointer2, Github, Laptop, Tablet, Smartphone, ChevronDown, Share2, Copy, Check, Loader2, Link as LinkIcon } from "lucide-react";
import IdePanel from "@/components/code/IdePanel";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface HealthCheckStatus {
  isChecking: boolean;
  isReady: boolean;
  elapsedSeconds: number;
  error?: string;
}

// Props interface for PreviewPanel component
export interface PreviewPanelProps {
  language: string;
  idea: string;
  currentRoute?: string;
  viewMode?: "desktop" | "tablet" | "mobile";
  generatedUrl?: string;
  healthCheckStatus?: HealthCheckStatus;
  onRefresh?: () => void;
  visualEditMode?: boolean;
  onVisualEditModeChange?: (enabled: boolean) => void;
  onElementSelect?: (elementId: string | null) => void;
  selectedElementId?: string | null;
}

// Get progressive status message based on elapsed time
const getProgressiveMessage = (elapsedSeconds: number): { emoji: string; message: string } => {
  if (elapsedSeconds < 15) {
    return { emoji: "🐳", message: "Booting up the Container..." };
  } else if (elapsedSeconds < 60) {
    return { emoji: "📦", message: "Installing Dependencies (This happens once)..." };
  } else if (elapsedSeconds < 120) {
    return { emoji: "⚙️", message: "Starting the Server... Almost there..." };
  } else {
    return { emoji: "🐢", message: "Heavy build detected! Still working, please hold on..." };
  }
};
// ── Publish Dropdown ──────────────────────
const PublishDropdown = () => {
  const [publishState, setPublishState] = useState<"idle" | "publishing" | "done">("idle");
  const [generatedUrl, setGeneratedUrl] = useState("");

  const handlePublish = () => {
    setPublishState("publishing");
    setTimeout(() => {
      const id = Math.random().toString(36).substring(2, 10);
      setGeneratedUrl(`mycodex.dev/p/${id}`);
      setPublishState("done");
    }, 2000);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(generatedUrl);
    toast.success("URL copied!");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(0,230,210,0.3)] transition-all duration-200">
          Publish
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 bg-popover border-border p-4 z-50">
        {publishState === "idle" && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Publish your project</p>
            <Button onClick={handlePublish} className="w-full">
              Publish
            </Button>
          </div>
        )}
        {publishState === "publishing" && (
          <div className="flex flex-col items-center gap-3 py-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Publishing...</p>
          </div>
        )}
        {publishState === "done" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Published!</p>
            </div>
            <div className="flex items-center gap-2">
              <Input value={generatedUrl} readOnly className="text-xs bg-secondary/50 border-border h-8" />
              <button onClick={handleCopyUrl} className="p-1.5 rounded-md text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

// ── Share Button ──────────────────────
const ShareButton = ({ publishedUrl }: { publishedUrl: string | null }) => {
  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-[0_0_12px_rgba(0,230,210,0.15)] transition-all duration-200"
          title="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 bg-popover border-border p-4 z-50">
        <p className="text-sm font-semibold text-foreground mb-3">Share via link</p>
        {publishedUrl ? (
          <div className="flex items-center gap-2">
            <Input value={publishedUrl} readOnly className="text-xs bg-secondary/50 border-border h-8" />
            <button onClick={() => handleCopy(publishedUrl)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <LinkIcon className="w-4 h-4 flex-shrink-0" />
            <p className="text-xs">Publish first to get a share link.</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const PreviewPanel = ({ 
  language, 
  idea, 
  currentRoute = "/",
  viewMode = "desktop",
  generatedUrl,
  healthCheckStatus,
  onRefresh,
  visualEditMode = false,
  onVisualEditModeChange,
  onElementSelect,
  selectedElementId
}: PreviewPanelProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [selectedDevice, setSelectedDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedRoute, setSelectedRoute] = useState("/");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const appRoutes = ["/", "/about", "/pricing", "/technologies", "/profile"];

  const deviceOptions = [
    { value: "desktop" as const, label: "Laptop", icon: Laptop },
    { value: "tablet" as const, label: "Tablet", icon: Tablet },
    { value: "mobile" as const, label: "Phone", icon: Smartphone },
  ];

  const activeDevice = deviceOptions.find(d => d.value === selectedDevice) || deviceOptions[0];

  // Inject click-to-select script into iframe when visual edit mode is enabled
  const injectVisualEditScript = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return;

    try {
      const doc = iframe.contentDocument;
      
      // Remove existing script if any
      const existingScript = doc.getElementById('visual-edit-script');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Remove existing styles if any
      const existingStyle = doc.getElementById('visual-edit-style');
      if (existingStyle) {
        existingStyle.remove();
      }

      if (visualEditMode) {
        // Inject styles for highlighting
        const style = doc.createElement('style');
        style.id = 'visual-edit-style';
        style.textContent = `
          .visual-edit-hover {
            outline: 2px dashed hsl(var(--primary, 221.2 83.2% 53.3%)) !important;
            outline-offset: 2px !important;
            cursor: crosshair !important;
          }
          .visual-edit-selected {
            outline: 3px solid hsl(var(--primary, 221.2 83.2% 53.3%)) !important;
            outline-offset: 2px !important;
            background-color: hsla(var(--primary, 221.2 83.2% 53.3%), 0.1) !important;
          }
        `;
        doc.head.appendChild(style);

        // Inject script for click detection
        const script = doc.createElement('script');
        script.id = 'visual-edit-script';
        script.textContent = `
          (function() {
            let hoveredElement = null;
            let selectedElement = null;

            document.addEventListener('mouseover', function(e) {
              if (hoveredElement) {
                hoveredElement.classList.remove('visual-edit-hover');
              }
              hoveredElement = e.target;
              if (hoveredElement && !hoveredElement.classList.contains('visual-edit-selected')) {
                hoveredElement.classList.add('visual-edit-hover');
              }
            }, true);

            document.addEventListener('mouseout', function(e) {
              if (hoveredElement) {
                hoveredElement.classList.remove('visual-edit-hover');
              }
            }, true);

            document.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              // Remove previous selection
              if (selectedElement) {
                selectedElement.classList.remove('visual-edit-selected');
              }
              
              selectedElement = e.target;
              selectedElement.classList.add('visual-edit-selected');
              selectedElement.classList.remove('visual-edit-hover');
              
              // Get element identifier (id, or generate a path)
              let elementId = selectedElement.id;
              if (!elementId) {
                // Generate a CSS selector path
                let path = [];
                let el = selectedElement;
                while (el && el.tagName) {
                  let selector = el.tagName.toLowerCase();
                  if (el.id) {
                    selector = '#' + el.id;
                    path.unshift(selector);
                    break;
                  } else if (el.className && typeof el.className === 'string') {
                    selector += '.' + el.className.trim().split(/\\s+/).join('.');
                  }
                  path.unshift(selector);
                  el = el.parentElement;
                }
                elementId = path.join(' > ');
              }
              
              // Send message to parent
              window.parent.postMessage({ 
                type: 'VISUAL_EDIT_SELECT', 
                elementId: elementId 
              }, '*');
            }, true);
          })();
        `;
        doc.body.appendChild(script);
      }
    } catch (error) {
      console.warn('[PreviewPanel] Could not inject visual edit script (cross-origin):', error);
    }
  }, [visualEditMode]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'VISUAL_EDIT_SELECT' && event.data?.elementId) {
        onElementSelect?.(event.data.elementId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onElementSelect]);

  // Re-inject script when iframe loads or visual edit mode changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      // Small delay to ensure content is ready
      setTimeout(injectVisualEditScript, 100);
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [injectVisualEditScript]);

  // Also inject when visualEditMode changes
  useEffect(() => {
    if (generatedUrl && healthCheckStatus?.isReady) {
      setTimeout(injectVisualEditScript, 100);
    }
  }, [visualEditMode, generatedUrl, healthCheckStatus?.isReady, injectVisualEditScript]);

  useEffect(() => {
    // If we have a generated URL and health check says ready, skip loading
    if (generatedUrl && healthCheckStatus?.isReady) {
      setIsLoading(false);
      setGenerationComplete(true);
      return;
    }

    // If we have URL but still checking, show the health check status instead
    if (generatedUrl && healthCheckStatus?.isChecking) {
      setIsLoading(false);
      return;
    }

    // If no URL yet, keep showing the generation progress UI
    // The GenerationProgress component handles its own mock progress
  }, [generatedUrl, healthCheckStatus?.isReady, healthCheckStatus?.isChecking]);

  const getPreviewWidth = () => {
    switch (selectedDevice) {
      case "mobile":
        return "max-w-[390px]";
      case "tablet":
        return "max-w-[820px]";
      default:
        return "w-full";
    }
  };

  const handleRefreshPreview = () => {
    if (onRefresh) {
      onRefresh();
    } else if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => { if (iframeRef.current) iframeRef.current.src = src; }, 50);
    }
  };

  const handleOpenInNewTab = () => {
    const base = generatedUrl || "about:blank";
    window.open(base, "_blank");
  };

  const progressMessage = healthCheckStatus ? getProgressiveMessage(healthCheckStatus.elapsedSeconds) : null;

  // Show health check loading state
  const showHealthCheckLoader = generatedUrl && healthCheckStatus?.isChecking && !healthCheckStatus?.isReady;
  const showHealthCheckError = generatedUrl && healthCheckStatus?.error;
  const showReadyState = generatedUrl && healthCheckStatus?.isReady;

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Health Check Status Banner */}
      {generatedUrl && (
        <div className={`px-4 py-4 border-b-2 flex flex-col gap-3 ${
          showReadyState 
            ? "bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30" 
            : showHealthCheckError
              ? "bg-gradient-to-r from-destructive/20 to-destructive/10 border-destructive/30"
              : "bg-gradient-to-r from-warning/20 to-warning/10 border-warning/30"
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {showReadyState ? (
                <>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-foreground">
                    ✅ Your app is ready!
                  </span>
                </>
              ) : showHealthCheckError ? (
                <>
                  <div className="w-3 h-3 bg-destructive rounded-full" />
                  <span className="text-sm font-medium text-foreground">
                    ⚠️ {healthCheckStatus?.error}
                  </span>
                </>
              ) : (
                <>
                  <motion.div 
                    className="w-3 h-3 bg-warning rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {progressMessage?.emoji} {progressMessage?.message}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({healthCheckStatus?.elapsedSeconds}s)
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground font-medium rounded-lg hover:bg-secondary/80 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              )}
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ExternalLink className="w-5 h-5" />
                OPEN APP
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Visual Edit Mode Toggle - Only show when project is ready */}
      {showReadyState && (
        <div className="px-4 py-3 border-b border-border bg-card/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MousePointer2 className={`w-4 h-4 ${visualEditMode ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className="flex flex-col">
              <Label htmlFor="visual-edit-mode" className="text-sm font-medium cursor-pointer">
                Visual Edit Mode
              </Label>
              <span className="text-xs text-muted-foreground">
                Click elements in the preview to target them
              </span>
            </div>
          </div>
          <Switch
            id="visual-edit-mode"
            checked={visualEditMode}
            onCheckedChange={(checked) => onVisualEditModeChange?.(checked)}
          />
        </div>
      )}

      {/* Preview / Code Toggle + Center Controls + Actions */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between sticky top-0 z-10 bg-muted/30">
        {/* Left: Preview/Code toggle */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "preview"
                ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_rgba(0,230,210,0.2)]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "code"
                ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_rgba(0,230,210,0.2)]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent"
            }`}
          >
            Code
          </button>
        </div>

        {/* Center: Unified control pill */}
        <div className="flex items-center h-9 rounded-full border border-primary/20 bg-secondary/60 backdrop-blur-sm shadow-[0_0_12px_rgba(0,230,210,0.08)] overflow-visible">
          {/* Device Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-full px-3 flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-200 rounded-l-full"
                title="Device view"
              >
                <activeDevice.icon className="w-4 h-4" />
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-[140px] z-50 bg-popover">
              {deviceOptions.map((device) => (
                <DropdownMenuItem
                  key={device.value}
                  onClick={() => setSelectedDevice(device.value)}
                  className={`flex items-center gap-2 cursor-pointer ${selectedDevice === device.value ? "text-primary" : ""}`}
                >
                  <device.icon className="w-4 h-4" />
                  <span>{device.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-4 bg-border/50" />

          {/* Routes Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-full px-3 flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-200 font-mono text-xs"
                title="Routes"
              >
                <span className="max-w-[80px] truncate">{selectedRoute}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-[160px] z-50 bg-popover">
              {appRoutes.map((route) => (
                <DropdownMenuItem
                  key={route}
                  onClick={() => setSelectedRoute(route)}
                  className={`font-mono text-xs cursor-pointer ${selectedRoute === route ? "text-primary" : ""}`}
                >
                  {route}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-4 bg-border/50" />

          {/* Open in New Tab */}
          <button
            onClick={handleOpenInNewTab}
            className="h-full px-3 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-200"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-border/50" />

          {/* Refresh */}
          <button
            onClick={handleRefreshPreview}
            className="h-full px-3 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-200 rounded-r-full"
            title="Refresh preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: GitHub + Publish + Share */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => console.log("GitHub export placeholder")}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-[0_0_12px_rgba(0,230,210,0.15)] transition-all duration-200"
            title="Export to GitHub"
          >
            <Github className="w-3.5 h-3.5" />
          </button>

          {/* Publish Dropdown */}
          <PublishDropdown />

          {/* Share Button */}
          <ShareButton publishedUrl={publishedUrl} />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto flex items-start justify-center">
        <div className={`${getPreviewWidth()} h-full mx-auto transition-all duration-300`}>
          {activeTab === "code" ? (
            <div className="h-full animate-fade-in" style={{ animationDuration: '150ms' }}>
              <IdePanel />
            </div>
          ) : !generatedUrl ? (
            /* Placeholder preview when no URL yet */
            <div className="h-full bg-card rounded-2xl border border-border overflow-hidden flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <ExternalLink className="w-8 h-8 text-primary/60" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">App Preview</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Your generated application will appear here. Start a conversation to build or modify your app.
              </p>
            </div>
          ) : (
            // Always display iframe immediately; overlay health-check UI on top while polling.
            <div className="h-full bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
              {/* Browser Chrome */}
              <div className="h-12 bg-muted/50 border-b border-border flex items-center px-4 gap-2 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-background border border-border rounded-lg flex items-center px-3 max-w-md">
                    <span className="text-xs text-muted-foreground font-mono truncate">
                      {generatedUrl}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Iframe */}
              <div className="flex-1 relative">
                <iframe
                  ref={iframeRef}
                  src={generatedUrl}
                  className={`absolute inset-0 w-full h-full border-0 ${visualEditMode ? 'cursor-crosshair' : ''}`}
                  title="Generated Application Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />

                {/* Overlay loader / error */}
                <AnimatePresence>
                  {(showHealthCheckLoader || showHealthCheckError) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-8"
                    >
                      {showHealthCheckError ? (
                        <>
                          <div className="text-5xl mb-4">⚠️</div>
                          <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
                            {healthCheckStatus?.error}
                          </h3>
                          <p className="text-sm text-muted-foreground text-center max-w-md">
                            If the app is already running, try Refresh. Otherwise, check your container logs.
                          </p>
                        </>
                      ) : (
                        <>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={progressMessage?.emoji}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="text-6xl mb-6"
                            >
                              {progressMessage?.emoji}
                            </motion.div>
                          </AnimatePresence>

                          <motion.div
                            className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mb-6"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <div className="w-8 h-8 border-3 border-warning border-t-transparent rounded-full" />
                          </motion.div>

                          <AnimatePresence mode="wait">
                            <motion.h3
                              key={progressMessage?.message}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-lg font-semibold text-foreground mb-2 text-center"
                            >
                              {progressMessage?.message}
                            </motion.h3>
                          </AnimatePresence>

                          <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                            Container is starting... Refresh if site is not reachable yet.
                          </p>

                          <div className="w-full max-w-xs">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-warning to-warning/60"
                                initial={{ width: "0%" }}
                                animate={{ width: `${Math.min((healthCheckStatus?.elapsedSeconds || 0) / 3, 100)}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                              {healthCheckStatus?.elapsedSeconds}s / 300s max
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;