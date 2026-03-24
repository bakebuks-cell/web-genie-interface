import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Folder, Clock, Plus, Trash2, Pencil, ExternalLink, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useGenerationStore } from "@/stores/useGenerationStore";

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

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  generating: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ready: "bg-primary/20 text-primary border-primary/30",
};

function getStackLabel(project: { mode: string; single_language: string | null; multi_stack: any }) {
  if (project.mode === "multi" && project.multi_stack) {
    const parts = [
      ...(project.multi_stack.frontend || []),
      ...(project.multi_stack.backend || []),
    ];
    return parts.map((p: string) => languageNames[p] || p).join(", ") || "Multi-stack";
  }
  return languageNames[project.single_language || "react"] || project.single_language || "React";
}

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useProjects();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) navigate("/auth-gate");
  }, [user, navigate]);

  if (!user) return null;

  const handleOpen = (project: any) => {
    navigate("/generate", {
      state: {
        language: project.single_language || "react",
        idea: project.prompt || "",
        projectId: project.id,
      },
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["projects", user.id] });
      toast({ title: "Deleted", description: "Project removed" });
    }
  };

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return;
    const { error } = await supabase.from("projects").update({ name: renameValue.trim() }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to rename project", variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["projects", user.id] });
      setRenamingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recent Applications</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16 text-muted-foreground text-sm">Loading projects…</div>
        )}

        {/* Empty state */}
        {!isLoading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 rounded-xl border border-border bg-secondary/20"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Code2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No recent applications yet</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              Create your first application and it will appear here.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
            >
              Create your first application
            </Button>
          </motion.div>
        )}

        {/* Project list */}
        {!isLoading && projects.length > 0 && (
          <div className="space-y-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/20 hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Folder className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {renamingId === project.id ? (
                      <form
                        onSubmit={(e) => { e.preventDefault(); handleRename(project.id); }}
                        className="flex items-center gap-2"
                      >
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="bg-background/60 border border-primary/30 rounded-md px-2 py-1 text-sm text-foreground outline-none focus:border-primary w-full max-w-xs"
                          onBlur={() => setRenamingId(null)}
                          onKeyDown={(e) => e.key === "Escape" && setRenamingId(null)}
                        />
                      </form>
                    ) : (
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {project.name}
                      </h4>
                    )}
                    {project.prompt && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                        {project.prompt.length > 80 ? project.prompt.slice(0, 80) + "…" : project.prompt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] border capitalize font-medium shrink-0 ${statusColors[project.status] || statusColors.draft}`}
                      >
                        {project.status}
                      </span>
                      <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                        {getStackLabel(project)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => { setRenamingId(project.id); setRenameValue(project.name); }}
                    title="Rename"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-400"
                    onClick={() => handleDelete(project.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 gap-1"
                    onClick={() => handleOpen(project)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
