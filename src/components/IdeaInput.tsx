import { Plus, Mic, Zap } from "lucide-react";

interface IdeaInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  disabled: boolean;
}

const IdeaInput = ({ value, onChange, onGenerate, disabled }: IdeaInputProps) => {
  const handleAttach = () => {
    // API integration will be added here
    console.log("Attach file clicked");
  };

  const handleVoice = () => {
    // API integration will be added here
    console.log("Voice input clicked");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center gap-3">
        <div className="flex-1 relative">
          {/* Left icons inside input */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={handleAttach}
              className="p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              title="Attach file"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe your application..."
            className="w-full pl-14 pr-24 py-5 rounded-2xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-lg"
          />
          
          {/* Right icons inside input */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={handleVoice}
              className="p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={onGenerate}
              disabled={disabled}
              className={`
                p-3 rounded-xl transition-all duration-300
                ${disabled 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-gradient-to-r from-primary to-accent-purple text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/30"
                }
              `}
              title="Generate"
            >
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>
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
