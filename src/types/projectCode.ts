/** A single file in a generated project */
export interface ProjectFile {
  path: string;
  content: string;
  language?: string;
}

/** Shape returned by the backend (or mock) */
export interface GeneratedProjectResponse {
  projectId: string;
  files: ProjectFile[];
}

/** Tree node used by the file explorer UI */
export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
}
