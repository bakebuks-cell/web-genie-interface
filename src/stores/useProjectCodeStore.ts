import { create } from "zustand";
import type { ProjectFile, FileTreeNode } from "@/types/projectCode";
import { fetchGeneratedProject } from "@/services/projectCodeService";

// ── Helpers ──────────────────────────────────

/** Derive a FileTreeNode hierarchy from flat file paths */
function buildFileTree(files: ProjectFile[]): FileTreeNode[] {
  const root: FileTreeNode = { name: "", path: "", type: "folder", children: [] };

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    parts.forEach((part, idx) => {
      const isLast = idx === parts.length - 1;
      const currentPath = parts.slice(0, idx + 1).join("/");
      let child = current.children?.find((c) => c.name === part);

      if (!child) {
        child = {
          name: part,
          path: currentPath,
          type: isLast ? "file" : "folder",
          children: isLast ? undefined : [],
        };
        current.children = current.children || [];
        current.children.push(child);
      }
      if (!isLast) current = child;
    });
  }

  // Sort: folders first, then alphabetically
  const sort = (nodes: FileTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => n.children && sort(n.children));
  };
  if (root.children) sort(root.children);

  return root.children || [];
}

// ── Store ────────────────────────────────────

interface ProjectCodeState {
  projectId: string | null;
  prompt: string;
  selectedStack: string | null;
  files: ProjectFile[];
  fileTree: FileTreeNode[];
  activeFilePath: string | null;
  openTabs: string[];
  status: "idle" | "loading" | "ready" | "error";
  errorMessage: string | null;

  // Actions
  setProjectMeta: (prompt: string, stack: string | null) => void;
  setFiles: (files: ProjectFile[]) => void;
  setActiveFile: (path: string) => void;
  closeTab: (path: string) => void;
  resetProject: () => void;
  loadProjectFiles: (projectId: string) => Promise<void>;
}

export const useProjectCodeStore = create<ProjectCodeState>((set, get) => ({
  projectId: null,
  prompt: "",
  selectedStack: null,
  files: [],
  fileTree: [],
  activeFilePath: null,
  openTabs: [],
  status: "idle",
  errorMessage: null,

  setProjectMeta: (prompt, stack) => set({ prompt, selectedStack: stack }),

  setFiles: (files) =>
    set({
      files,
      fileTree: buildFileTree(files),
      status: "ready",
    }),

  setActiveFile: (path) => {
    const { openTabs } = get();
    set({
      activeFilePath: path,
      openTabs: openTabs.includes(path) ? openTabs : [...openTabs, path],
    });
  },

  closeTab: (path) => {
    const { openTabs, activeFilePath } = get();
    const next = openTabs.filter((t) => t !== path);
    set({
      openTabs: next,
      activeFilePath:
        activeFilePath === path ? next[next.length - 1] ?? null : activeFilePath,
    });
  },

  resetProject: () =>
    set({
      projectId: null,
      prompt: "",
      selectedStack: null,
      files: [],
      fileTree: [],
      activeFilePath: null,
      openTabs: [],
      status: "idle",
      errorMessage: null,
    }),

  loadProjectFiles: async (projectId) => {
    set({ status: "loading", errorMessage: null, projectId });
    try {
      const res = await fetchGeneratedProject(projectId);
      const tree = buildFileTree(res.files);
      const defaultFile = res.files.length > 0 ? res.files[0].path : null;
      set({
        files: res.files,
        fileTree: tree,
        activeFilePath: defaultFile,
        openTabs: defaultFile ? [defaultFile] : [],
        status: "ready",
      });
    } catch (e: any) {
      set({ status: "error", errorMessage: e?.message ?? "Failed to load project files" });
    }
  },
}));
