import { useState } from "react";
import { Check, Code2 } from "lucide-react";

interface TechStack {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const techStacks: TechStack[] = [
  {
    id: "php",
    name: "PHP",
    description: "Laravel or vanilla PHP backend",
    icon: "🐘",
  },
  {
    id: "java-spring",
    name: "Java Spring Boot",
    description: "Enterprise-grade Java framework",
    icon: "☕",
  },
  {
    id: "python-django",
    name: "Python Django",
    description: "Batteries-included Python framework",
    icon: "🐍",
  },
  {
    id: "aspnet",
    name: "ASP.NET",
    description: "Microsoft's web framework",
    icon: "💠",
  },
  {
    id: "node-react",
    name: "Node.js + React",
    description: "Full-stack JavaScript solution",
    icon: "⚛️",
  },
];

interface TechStackSelectorProps {
  selectedStack: string | null;
  onSelect: (stackId: string) => void;
}

export const TechStackSelector = ({ selectedStack, onSelect }: TechStackSelectorProps) => {
  return (
    <div className="w-full animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-medium text-foreground">
          Choose Your Technology Stack
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {techStacks.map((stack) => {
          const isSelected = selectedStack === stack.id;
          
          return (
            <button
              key={stack.id}
              onClick={() => onSelect(stack.id)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-medium"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-soft"
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}

              {/* Icon */}
              <span className="text-3xl mb-3 block">{stack.icon}</span>

              {/* Name */}
              <h4 className={`font-semibold mb-1 transition-colors ${
                isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
              }`}>
                {stack.name}
              </h4>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {stack.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
