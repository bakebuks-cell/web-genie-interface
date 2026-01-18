import { useState } from "react";
import { Check } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: string | null;
  onSelect: (language: string) => void;
}

const languages = [
  { id: "php", name: "PHP", icon: "🐘" },
  { id: "java", name: "Java Spring Boot", icon: "☕" },
  { id: "python", name: "Python Django", icon: "🐍" },
  { id: "dotnet", name: "ASP.NET", icon: "🔷" },
  { id: "node-react", name: "Node.js + React", icon: "⚛️" },
];

const LanguageSelector = ({ selectedLanguage, onSelect }: LanguageSelectorProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onSelect(lang.id)}
          className={`
            relative px-5 py-3 rounded-full border-2 transition-all duration-300 font-medium
            ${selectedLanguage === lang.id
              ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20"
              : "border-border bg-card hover:border-primary/50 hover:bg-accent/50 text-foreground"
            }
          `}
        >
          <span className="mr-2">{lang.icon}</span>
          {lang.name}
          {selectedLanguage === lang.id && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
              <Check className="w-3 h-3" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
