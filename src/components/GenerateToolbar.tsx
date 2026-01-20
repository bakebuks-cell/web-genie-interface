import { Globe, Cloud, Palette, Code, BarChart3, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GenerateToolbarProps {
  userInitial?: string;
  currentPath?: string;
}

const GenerateToolbar = ({ userInitial = "B", currentPath = "/" }: GenerateToolbarProps) => {
  return (
    <div className="h-14 bg-background border-b border-border flex items-center justify-between px-4 flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 gap-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
        >
          <Globe className="w-4 h-4" />
          Preview
        </Button>
        
        <div className="w-px h-5 bg-border mx-1" />
        
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Cloud className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Palette className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Code className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <BarChart3 className="w-4 h-4" />
        </Button>
      </div>

      {/* Center Section - Path Indicator */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center h-9 px-4 bg-muted/50 border border-border rounded-lg">
          <span className="text-sm text-muted-foreground font-mono">{currentPath}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold uppercase shadow-sm">
          {userInitial}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-4 gap-2 text-sm font-medium rounded-lg border-border hover:bg-muted"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        
        <Button
          size="sm"
          className="h-9 px-5 text-sm font-medium rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        >
          Publish
        </Button>
      </div>
    </div>
  );
};

export default GenerateToolbar;
