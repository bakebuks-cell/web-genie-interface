import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSelectorProps {
  selectedLanguage: string | null;
  onSelect: (language: string) => void;
}

const languages = [
  { id: "php", name: "PHP", icon: "🐘", description: "Server-side scripting" },
  { id: "java", name: "Java Spring Boot", icon: "☕", description: "Enterprise applications" },
  { id: "python", name: "Python Django", icon: "🐍", description: "Rapid development" },
  { id: "dotnet", name: "ASP.NET", icon: "🔷", description: "Microsoft ecosystem" },
  { id: "node-react", name: "Node.js + React", icon: "⚛️", description: "Full-stack JavaScript" },
];

const LanguageSelector = ({ selectedLanguage, onSelect }: LanguageSelectorProps) => {
  const selectedLang = languages.find(l => l.id === selectedLanguage);

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all duration-300 min-w-[280px]">
            {selectedLang ? (
              <>
                <span className="text-2xl">{selectedLang.icon}</span>
                <div className="text-left flex-1">
                  <p className="font-medium text-foreground">{selectedLang.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedLang.description}</p>
                </div>
                <Check className="w-5 h-5 text-primary" />
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-lg">🔧</span>
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-foreground">Select Technology</p>
                  <p className="text-sm text-muted-foreground">Choose your framework</p>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-[280px] p-2 bg-card border border-border rounded-xl shadow-large"
          align="center"
        >
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${selectedLanguage === lang.id 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-accent/50"
                }
              `}
            >
              <span className="text-xl">{lang.icon}</span>
              <div className="flex-1">
                <p className="font-medium">{lang.name}</p>
                <p className="text-xs text-muted-foreground">{lang.description}</p>
              </div>
              {selectedLanguage === lang.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
