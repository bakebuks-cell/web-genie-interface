import { useState, useEffect, useRef, useCallback } from "react";
import { ExternalLink, RefreshCw, MousePointer2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import GenerationDashboard from "@/components/GenerationDashboard";
import { useNavigate } from "react-router-dom";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    switch (viewMode) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "w-full";
    }
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

      <div className="flex-1 p-4 overflow-auto flex items-start justify-center">
        <div className={`${getPreviewWidth()} h-full mx-auto transition-all duration-300`}>
          {!generatedUrl ? (
            <GenerationDashboard
              language={language}
              idea={idea}
              onComplete={() => setGenerationComplete(true)}
              onOpenApp={() => {
                console.log("Open app clicked - waiting for backend URL");
              }}
              onGenerateAgain={() => {
                navigate("/");
              }}
            />
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