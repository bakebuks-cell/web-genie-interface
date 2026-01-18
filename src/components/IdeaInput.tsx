import { Paperclip, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IdeaInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  disabled: boolean;
}

const IdeaInput = ({ value, onChange, onGenerate, disabled }: IdeaInputProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe your idea..."
            className="w-full pl-14 pr-14 py-4 rounded-2xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-lg"
          />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <Button
          onClick={onGenerate}
          disabled={disabled}
          size="lg"
          className="px-6 py-6 rounded-2xl bg-gradient-to-r from-primary to-accent-purple hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate
        </Button>
      </div>
      
      {disabled && (
        <p className="text-center text-muted-foreground text-sm mt-3 animate-pulse">
          Please select a programming language first
        </p>
      )}
    </div>
  );
};

export default IdeaInput;
