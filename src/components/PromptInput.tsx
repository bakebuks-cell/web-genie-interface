import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

const MAX_CHARACTERS = 2000;

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PromptInput = ({ value, onChange }: PromptInputProps) => {
  const characterCount = value.length;
  const isNearLimit = characterCount > MAX_CHARACTERS * 0.8;
  const isAtLimit = characterCount >= MAX_CHARACTERS;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARACTERS) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-primary" />
        <label className="text-sm font-medium text-foreground">
          Describe Your Application
        </label>
      </div>
      
      <div className="relative">
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder="Describe the web application you want to build...

For example:
• A task management app with user authentication and drag-and-drop functionality
• An e-commerce store with product catalog, shopping cart, and checkout
• A blog platform with markdown editor, categories, and comments"
          className="min-h-[200px] resize-none bg-card border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-soft hover:shadow-medium"
        />
        
        {/* Character Counter */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`text-xs font-medium transition-colors ${
              isAtLimit
                ? "text-destructive"
                : isNearLimit
                ? "text-amber-500"
                : "text-muted-foreground"
            }`}
          >
            {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
