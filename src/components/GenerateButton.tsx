import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";

interface GenerateButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export const GenerateButton = ({ isLoading, isDisabled, onClick }: GenerateButtonProps) => {
  return (
    <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
      <Button
        size="lg"
        onClick={onClick}
        disabled={isDisabled || isLoading}
        className={`
          relative px-8 py-6 text-lg font-semibold rounded-xl
          bg-primary hover:bg-primary/90 text-primary-foreground
          shadow-medium hover:shadow-large
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isLoading ? "animate-pulse-glow" : ""}
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5 mr-2" />
            Generate Web Application
          </>
        )}
      </Button>
    </div>
  );
};
