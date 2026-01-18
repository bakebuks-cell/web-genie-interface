import { Plus, Mic, Zap, Lock } from "lucide-react";

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

  const canGenerate = !disabled && value.trim().length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className={`
        relative transition-all duration-500
        ${disabled ? "opacity-60" : "opacity-100"}
      `}>
        {/* Glass container */}
        <div className={`
          relative rounded-2xl overflow-hidden
          ${disabled 
            ? "glass-card border-border/30" 
            : "glass-card border-primary/20 shadow-glow"
          }
          transition-all duration-300
        `}>
          {/* Animated border glow when active */}
          {!disabled && (
            <div className="absolute inset-0 rounded-2xl animate-border-glow border-2 border-transparent pointer-events-none" />
          )}
          
          <div className="relative flex items-center gap-2 p-2">
            {/* Left icons */}
            <div className="flex items-center">
              <button
                onClick={handleAttach}
                disabled={disabled}
                className={`
                  p-3 rounded-xl transition-all duration-300
                  ${disabled 
                    ? "text-muted-foreground/50 cursor-not-allowed" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }
                `}
                title="Attach file"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {/* Input field */}
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder={disabled ? "Select a technology first..." : "Describe your application idea..."}
              className={`
                flex-1 py-4 px-2 bg-transparent text-foreground placeholder:text-muted-foreground/60 
                focus:outline-none text-lg
                ${disabled ? "cursor-not-allowed" : ""}
              `}
            />
            
            {/* Right icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleVoice}
                disabled={disabled}
                className={`
                  p-3 rounded-xl transition-all duration-300
                  ${disabled 
                    ? "text-muted-foreground/50 cursor-not-allowed" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }
                `}
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <button
                onClick={onGenerate}
                disabled={!canGenerate}
                className={`
                  p-3 rounded-xl transition-all duration-300 relative group
                  ${canGenerate 
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:shadow-neon hover:scale-105" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                  }
                `}
                title="Generate"
              >
                {disabled ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <Zap className={`w-5 h-5 ${canGenerate ? "animate-pulse" : ""}`} />
                )}
                
                {/* Glow effect */}
                {canGenerate && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-accent blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Helper text */}
      <div className="text-center mt-4">
        {disabled ? (
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Select a technology to continue
          </p>
        ) : value.trim().length === 0 ? (
          <p className="text-muted-foreground/60 text-sm">
            Describe what you want to build
          </p>
        ) : (
          <p className="text-primary text-sm animate-pulse">
            Ready to generate your application
          </p>
        )}
      </div>
    </div>
  );
};

export default IdeaInput;
