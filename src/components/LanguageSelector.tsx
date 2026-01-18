import { Check } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: string | null;
  onSelect: (language: string) => void;
}

const languages = [
  { 
    id: "php", 
    name: "PHP", 
    icon: "🐘", 
    description: "Server-side scripting for dynamic web apps",
    color: "from-indigo-500 to-purple-600"
  },
  { 
    id: "java", 
    name: "Java Spring Boot", 
    icon: "☕", 
    description: "Enterprise-grade application framework",
    color: "from-orange-500 to-red-600"
  },
  { 
    id: "python", 
    name: "Python Django", 
    icon: "🐍", 
    description: "Rapid development with batteries included",
    color: "from-green-500 to-emerald-600"
  },
  { 
    id: "dotnet", 
    name: "ASP.NET", 
    icon: "🔷", 
    description: "Microsoft's powerful web framework",
    color: "from-blue-500 to-cyan-600"
  },
  { 
    id: "node-react", 
    name: "Node.js + React", 
    icon: "⚛️", 
    description: "Full-stack JavaScript excellence",
    color: "from-cyan-500 to-blue-600"
  },
];

const LanguageSelector = ({ selectedLanguage, onSelect }: LanguageSelectorProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Choose your technology
        </h2>
        <p className="text-sm text-muted-foreground">
          Select the framework for your application
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className={`
                relative group p-5 rounded-2xl transition-all duration-300 text-left
                glass-card border
                ${isSelected 
                  ? "border-primary/50 shadow-glow" 
                  : "border-border/50 hover:border-primary/30"
                }
              `}
            >
              {/* Glow effect on hover/select */}
              <div className={`
                absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
                bg-gradient-to-br ${lang.color}
                ${isSelected ? "opacity-10" : "group-hover:opacity-5"}
              `} />
              
              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <div className="relative z-10">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl
                  bg-gradient-to-br ${lang.color} bg-opacity-20
                  ${isSelected ? "animate-pulse-glow" : "group-hover:scale-110"}
                  transition-transform duration-300
                `}>
                  {lang.icon}
                </div>
                <h3 className={`
                  font-semibold mb-1 text-sm transition-colors duration-300
                  ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}
                `}>
                  {lang.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {lang.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
