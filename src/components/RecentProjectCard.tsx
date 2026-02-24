import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

const STORAGE_KEY = "mycodex_recent_project";

export function saveRecentProject(project: RecentProject) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch {}
}

export function getRecentProject(userId?: string): RecentProject | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const project = JSON.parse(raw) as RecentProject;
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
  const recent = getRecentProject(user?.id);

  if (!recent) return null;

  const stackLabel = recent.mode === "multi" && recent.multiStackSummary
    ? recent.multiStackSummary
    : languageNames[recent.language] || recent.language;

  const promptSnippet = recent.promptText.length > 80
    ? recent.promptText.slice(0, 80) + "…"
    : recent.promptText;

  const timeAgo = (() => {
    const diff = Date.now() - new Date(recent.updatedAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  const handleOpen = () => {
    navigate("/generate", {
      state: {
        language: recent.language,
        idea: recent.idea,
      },
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className="rounded-xl p-4 cursor-pointer group transition-all duration-300"
        style={{
          background: "rgba(30, 30, 30, 0.5)",
          border: "1px solid rgba(0, 230, 210, 0.15)",
        }}
        whileHover={{
          boxShadow: "0 0 30px rgba(0, 230, 210, 0.15)",
          borderColor: "rgba(0, 230, 210, 0.3)",
        }}
        onClick={handleOpen}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
              <span className="px-2 py-0.5 text-[10px] font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
                {stackLabel}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-foreground truncate">
              {recent.projectName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {promptSnippet}
            </p>
          </div>
          <button
            className="ml-3 p-2 rounded-lg text-muted-foreground group-hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RecentProjectCard;
