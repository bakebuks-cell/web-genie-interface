import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Mic, Zap, ChevronDown, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "typescript", name: "TypeScript" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "php", name: "PHP" },
  { id: "ruby", name: "Ruby on Rails" },
  { id: "django", name: "Django" },
];

export const HeroSection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [idea, setIdea] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const selectedLang = languages.find((l) => l.id === selectedLanguage);

  const handleGenerate = () => {
    if (!selectedLanguage) {
      toast({
        title: "Select a Language",
        description: "Please select a programming language first",
        variant: "destructive",
      });
      return;
    }
    if (!idea.trim()) {
      toast({
        title: "Describe Your Application",
        description: "Please describe the application you want to build",
        variant: "destructive",
      });
      return;
    }
    navigate("/generate", { state: { language: selectedLanguage, idea } });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8 max-w-2xl mx-auto">
        {/* Headline */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Build fast.
        </motion.h1>
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          style={{ color: "hsl(0 0% 55%)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Ship lean.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-4 text-sm md:text-base font-light tracking-wide"
          style={{ color: "hsl(0 0% 50%)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Turn ideas into production-ready apps using AI.
        </motion.p>

        {/* Pills */}
        <motion.div
          className="flex justify-center gap-3 mt-5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {["AI-Powered", "Production-Ready"].map((badge) => (
            <span
              key={badge}
              className="px-3 py-1 text-xs font-medium rounded-full border"
              style={{
                color: "hsl(250 83% 70%)",
                backgroundColor: "hsl(250 83% 60% / 0.1)",
                borderColor: "hsl(250 83% 60% / 0.25)",
              }}
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Glassmorphism Input Card */}
      <motion.div
        className="w-full max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div
          className="relative flex flex-col p-5 rounded-2xl border"
          style={{
            background: "hsl(0 0% 4% / 0.7)",
            backdropFilter: "blur(24px)",
            borderColor: "hsl(250 83% 60% / 0.35)",
            boxShadow:
              "0 0 30px hsl(250 83% 60% / 0.12), 0 0 60px hsl(270 70% 50% / 0.06)",
          }}
        >
          {/* Textarea */}
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your application idea…"
            rows={3}
            className="w-full bg-transparent text-white placeholder:text-white/30 focus:outline-none text-sm leading-relaxed resize-none"
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                style={{
                  borderColor: selectedLanguage
                    ? "hsl(250 83% 60% / 0.4)"
                    : "hsl(0 0% 20%)",
                  backgroundColor: selectedLanguage
                    ? "hsl(250 83% 60% / 0.1)"
                    : "hsl(0 0% 8%)",
                  color: selectedLanguage ? "hsl(0 0% 90%)" : "hsl(0 0% 50%)",
                }}
              >
                <span className="font-medium">
                  {selectedLang ? selectedLang.name : "Select Language"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 opacity-60 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 bottom-full mb-2 w-56 rounded-xl border overflow-hidden z-50"
                    style={{
                      background: "hsl(0 0% 6%)",
                      borderColor: "hsl(0 0% 15%)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div className="py-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => {
                            setSelectedLanguage(lang.id);
                            setDropdownOpen(false);
                            toast({
                              title: "Language Selected",
                              description: `You selected ${lang.name}`,
                            });
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-100"
                          style={{
                            color:
                              selectedLanguage === lang.id
                                ? "hsl(250 83% 70%)"
                                : "hsl(0 0% 75%)",
                            backgroundColor:
                              selectedLanguage === lang.id
                                ? "hsl(250 83% 60% / 0.1)"
                                : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (selectedLanguage !== lang.id) {
                              e.currentTarget.style.backgroundColor =
                                "hsl(0 0% 10%)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedLanguage !== lang.id) {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }
                          }}
                        >
                          <span>{lang.name}</span>
                          {selectedLanguage === lang.id && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                    {/* Multiple Programs option */}
                    <div
                      className="border-t px-4 py-2.5 flex items-center gap-2 text-sm cursor-pointer transition-colors"
                      style={{
                        borderColor: "hsl(0 0% 15%)",
                        color: "hsl(45 100% 65%)",
                        backgroundColor: "hsl(45 80% 50% / 0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "hsl(45 80% 50% / 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "hsl(45 80% 50% / 0.05)";
                      }}
                      onClick={() => {
                        setDropdownOpen(false);
                        toast({
                          title: "Multiple Programs",
                          description: "Generate across multiple stacks",
                        });
                      }}
                    >
                      <Zap className="w-4 h-4" />
                      <span className="font-medium">Multiple Programs</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <button
                className="p-2.5 rounded-xl transition-all duration-200"
                style={{ color: "hsl(0 0% 45%)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "hsl(0 0% 80%)";
                  e.currentTarget.style.backgroundColor = "hsl(0 0% 10%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "hsl(0 0% 45%)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                className="p-2.5 rounded-xl transition-all duration-200"
                style={{ color: "hsl(0 0% 45%)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "hsl(0 0% 80%)";
                  e.currentTarget.style.backgroundColor = "hsl(0 0% 10%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "hsl(0 0% 45%)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white transition-all duration-300 active:scale-95"
                style={{
                  background: "hsl(250 83% 60%)",
                  boxShadow: "0 0 20px hsl(250 83% 60% / 0.3)",
                  animation: "pulseGlow 3s ease-in-out infinite",
                }}
              >
                <Zap className="w-4 h-4" />
                <span>Generate</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
