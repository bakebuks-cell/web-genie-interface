import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export interface RecentProject {
  projectId: string;
  projectName: string;
  promptText: string;
  mode: "single" | "multi";
  singleLanguage?: string | null;
  multiStackSummary?: string;
  language: string;
  idea: string;
  updatedAt: string;
}

const STORAGE_KEY = "mycodex_latest_project";

export function saveRecentProject(project: RecentProject) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    console.log("Saved latest project:", project);
  } catch {}
}

export function getRecentProject(): RecentProject | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const project = JSON.parse(raw) as RecentProject;
    console.log("Loaded latest project:", project);
    return project;
  } catch {
    return null;
  }
}

export function clearRecentProject() {
  localStorage.removeItem(STORAGE_KEY);
}

const languageNames: Record<string, string> = {
  html: "HTML/CSS/JS",
  php: "PHP",
  nodejs: "Node/TS",
  python: "Python",
  golang: "Golang",
  react: "React",
  java: "Java",
  csharp: "ASP.NET",
};

const RecentProjectCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cleared, setCleared] = useState(false);
  const recent = getRecentProject();

  if (!user || !recent || cleared) return null;

  const stackLabel = recent.mode === "multi" && recent.multiStackSummary
    ? recent.multiStackSummary
    : languageNames[recent.language] || recent.language;

  const promptSnippet = recent.promptText.length > 80
    ? recent.promptText.slice(0, 80) + "…"
    : recent.promptText;

  const handleOpen = () => {
    navigate("/generate", {
      state: {
        language: recent.language,
        idea: recent.idea,
      },
    });
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentProject();
    setCleared(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Recent Application</h3>
      <motion.div
        className="rounded-xl p-4 transition-all duration-300"
        style={{
          background: "rgba(30, 30, 30, 0.5)",
          border: "1px solid rgba(0, 230, 210, 0.15)",
        }}
        whileHover={{
          boxShadow: "0 0 30px rgba(0, 230, 210, 0.15)",
          borderColor: "rgba(0, 230, 210, 0.3)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="px-2 py-0.5 text-[10px] font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
                {stackLabel}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-foreground truncate">
              {recent.projectName}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {promptSnippet}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-border/50 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
              onClick={handleOpen}
            >
              Open
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecentProjectCard;
