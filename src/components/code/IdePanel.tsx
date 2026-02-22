import { useEffect } from "react";
import { File, Folder, Search, ChevronDown, ChevronRight, X, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useProjectCodeStore } from "@/stores/useProjectCodeStore";
import type { FileTreeNode } from "@/types/projectCode";
import { useState } from "react";

// ── Tree node renderer ──────────────────────

interface TreeNodeProps {
  node: FileTreeNode;
  depth: number;
  activeFilePath: string | null;
  onSelect: (path: string) => void;
}

const TreeNode = ({ node, depth, activeFilePath, onSelect }: TreeNodeProps) => {
  const [open, setOpen] = useState(true);
  const isFolder = node.type === "folder";
  const isActive = !isFolder && node.path === activeFilePath;

  return (
    <div>
      <button
        onClick={() => (isFolder ? setOpen(!open) : onSelect(node.path))}
        className={cn(
          "w-full flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-primary/10 transition-colors rounded-sm",
          isActive && "bg-primary/15 text-primary"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder ? (
          open ? (
            <ChevronDown className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-3" />
        )}
        {isFolder ? (
          <Folder className="w-3.5 h-3.5 flex-shrink-0 text-primary/70" />
        ) : (
          <File className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
        )}
        <span className={cn("truncate", isActive ? "text-primary font-medium" : "text-foreground/80")}>
          {node.name}
        </span>
      </button>
      {isFolder &&
        open &&
        node.children?.map((child) => (
          <TreeNode key={child.path} node={child} depth={depth + 1} activeFilePath={activeFilePath} onSelect={onSelect} />
        ))}
    </div>
  );
};

// ── Main IDE Panel ──────────────────────────

const IdePanel = () => {
  const {
    files,
    fileTree,
    activeFilePath,
    openTabs,
    status,
    errorMessage,
    setActiveFile,
    closeTab,
    loadProjectFiles,
    projectId,
  } = useProjectCodeStore();

  const [searchQuery, setSearchQuery] = useState("");

  // Auto-load mock files when the panel mounts and status is idle
  useEffect(() => {
    if (status === "idle") {
      loadProjectFiles(projectId || "demo");
    }
  }, [status, projectId, loadProjectFiles]);

  // ── Loading state ──
  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center bg-background rounded-2xl border border-border">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm">Loading project files…</span>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (status === "error") {
    return (
      <div className="h-full flex items-center justify-center bg-background rounded-2xl border border-border">
        <p className="text-sm text-destructive">{errorMessage ?? "Something went wrong."}</p>
      </div>
    );
  }

  // ── Empty state ──
  if (status === "ready" && files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-background rounded-2xl border border-border">
        <p className="text-sm text-muted-foreground">No code available yet. Generate an app first.</p>
      </div>
    );
  }

  // Active file content
  const activeFile = files.find((f) => f.path === activeFilePath);
  const code = activeFile?.content ?? "";
  const lines = code.split("\n");

  // Filter tree by search
  const filterTree = (nodes: FileTreeNode[], q: string): FileTreeNode[] => {
    if (!q) return nodes;
    const lower = q.toLowerCase();
    return nodes
      .map((n) => {
        if (n.type === "file") {
          return n.name.toLowerCase().includes(lower) ? n : null;
        }
        const filtered = filterTree(n.children || [], q);
        return filtered.length > 0 ? { ...n, children: filtered } : null;
      })
      .filter(Boolean) as FileTreeNode[];
  };

  const visibleTree = filterTree(fileTree, searchQuery);

  const fileNameFromPath = (p: string) => p.split("/").pop() ?? p;

  return (
    <div className="h-full flex bg-background rounded-2xl border border-border overflow-hidden">
      {/* File Explorer Sidebar */}
      <div className="w-[240px] flex-shrink-0 border-r border-border flex flex-col bg-card/60">
        <div className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
          Explorer
        </div>
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pl-7 text-xs bg-secondary/40 border-border/50"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="py-1">
            {visibleTree.map((node) => (
              <TreeNode key={node.path} node={node} depth={0} activeFilePath={activeFilePath} onSelect={setActiveFile} />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <div className="h-9 flex items-center bg-card/40 border-b border-border overflow-x-auto">
          {openTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFile(tab)}
              className={cn(
                "h-full px-3 flex items-center gap-2 text-xs border-r border-border whitespace-nowrap transition-colors",
                tab === activeFilePath
                  ? "bg-background text-foreground border-b-2 border-b-primary"
                  : "text-muted-foreground hover:bg-secondary/30"
              )}
            >
              <File className="w-3 h-3" />
              {fileNameFromPath(tab)}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab);
                }}
                className="ml-1 hover:bg-secondary rounded p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>

        {/* Code */}
        <ScrollArea className="flex-1">
          <div className="p-4 font-mono text-[13px] leading-6">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-10 text-right pr-4 text-muted-foreground/40 select-none flex-shrink-0">
                  {i + 1}
                </span>
                <pre className="text-foreground/85 whitespace-pre">{line || " "}</pre>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Status Bar */}
        <div className="h-6 flex items-center justify-between px-3 bg-primary/10 border-t border-border text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{activeFile?.language ?? "TypeScript"}</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Ln 1, Col 1</span>
            <span>Spaces: 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdePanel;
