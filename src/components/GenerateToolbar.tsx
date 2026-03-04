import { useState, useRef, useEffect } from "react";
import { 
  Globe, 
  Cloud, 
  Palette, 
  Code, 
  TrendingUp, 
  Plus,
  Monitor,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GenerateToolbarProps {
  userInitial?: string;
  currentPath?: string;
  onPathChange?: (path: string) => void;
  onOpenExternal?: () => void;
  onRefresh?: () => void;
  onDeviceChange?: (device: "desktop" | "tablet" | "mobile") => void;
  selectedDevice?: "desktop" | "tablet" | "mobile";
}

const MOCK_ROUTES = [
  { path: "/", label: "Home" },
  { path: "/login", label: "Login" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/settings", label: "Settings" },
  { path: "/profile", label: "Profile" },
];

const GenerateToolbar = ({ 
  userInitial = "b", 
  currentPath = "/",
  onPathChange,
  onOpenExternal,
  onRefresh,
  onDeviceChange,
  selectedDevice = "desktop"
}: GenerateToolbarProps) => {
  const [isRouteDropdownOpen, setIsRouteDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRouteDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePathSelect = (path: string) => {
    onPathChange?.(path);
    setIsRouteDropdownOpen(false);
  };

  const handleOpenExternal = () => {
    onOpenExternal?.();
    // Fallback: open mock URL in new tab
    window.open(`https://preview.example.com${currentPath}`, "_blank");
  };

  return (
    <div className="h-14 bg-background border-b border-border flex items-center justify-between px-3 flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-0.5">
        {/* Preview Button - Pill Style with Border */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 gap-2 text-sm font-medium text-foreground rounded-full border-border bg-background hover:bg-muted"
        >
          <Globe className="w-4 h-4" />
          Preview
        </Button>
        
        <div className="w-px h-5 bg-border mx-2" />
        
        {/* Icon Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Cloud className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Palette className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Code className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <TrendingUp className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Center Section - Device & Path Selector */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        {/* Device Selector */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-lg",
            selectedDevice === "desktop" 
              ? "bg-muted text-foreground" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          onClick={() => onDeviceChange?.("desktop")}
        >
          <Monitor className="w-4 h-4" />
        </Button>

        {/* Route Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsRouteDropdownOpen(!isRouteDropdownOpen)}
            className="flex items-center h-8 px-3 gap-1 bg-background border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <span className="text-sm text-foreground font-mono">{currentPath}</span>
            <ChevronDown className={cn(
              "w-3 h-3 text-muted-foreground transition-transform",
              isRouteDropdownOpen && "rotate-180"
            )} />
          </button>

          {/* Dropdown Menu */}
          {isRouteDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 py-1 overflow-hidden">
              {MOCK_ROUTES.map((route) => (
                <button
                  key={route.path}
                  onClick={() => handlePathSelect(route.path)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center justify-between",
                    currentPath === route.path && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="font-mono">{route.path}</span>
                  <span className="text-muted-foreground text-xs">{route.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        {/* External Link Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={handleOpenExternal}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>

        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* User Avatar - Green background */}
        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-semibold lowercase">
          {userInitial}
        </div>
        
        {/* Share Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-sm font-medium rounded-lg text-foreground hover:bg-muted"
        >
          Share
        </Button>

        {/* GitHub Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Github className="w-4 h-4" />
        </Button>
        
        {/* Publish Button - Green */}
        <Button
          size="sm"
          className="h-8 px-4 text-sm font-medium rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
        >
          Publish
        </Button>
      </div>
    </div>
  );
};

export default GenerateToolbar;
