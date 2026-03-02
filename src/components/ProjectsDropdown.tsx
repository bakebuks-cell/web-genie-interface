import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Clock, Plus, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects, type Project } from "@/hooks/useProjects";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  generating: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ready: "bg-primary/20 text-primary border-primary/30",
};

export const ProjectsDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useProjects();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = (project: Project) => {
    setOpen(false);
    navigate("/generate", {
      state: {
        language: project.single_language || "react",
        idea: project.prompt || "",
        projectId: project.id,
      },
    });
  };

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-full px-4 h-8 text-sm gap-1.5"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        Projects
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-background/80 backdrop-blur-2xl border border-primary/15 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-primary/10 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Your Projects</span>
              <button
                onClick={() => { setOpen(false); navigate("/"); }}
                className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="New project"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto scrollbar-hide">
              {isLoading ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">Loading…</div>
              ) : projects.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Folder className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">No projects yet</p>
                  <button
                    onClick={() => { setOpen(false); navigate("/"); }}
                    className="text-xs text-primary hover:underline"
                  >
                    Create your first project
                  </button>
                </div>
              ) : (
                <div className="py-1">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleOpen(p)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {p.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border capitalize shrink-0 ${statusColors[p.status] || statusColors.draft}`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(p.updated_at), { addSuffix: true })}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
