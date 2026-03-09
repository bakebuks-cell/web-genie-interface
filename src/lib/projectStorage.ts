const STORAGE_KEY = "mycodex_projects";
const LAST_OPENED_KEY = "mycodex_last_opened_project";

export interface LocalProject {
  projectId: string;
  projectName: string;
  prompt: string;
  mode: "single" | "multi";
  singleLanguage: string | null;
  multiStack: { frontend: string[]; backend: string[]; database: string[] } | null;
  status: "generating" | "ready" | "draft";
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;
  previewState: Record<string, unknown> | null;
  editHistory: unknown[];
  builderState: Record<string, unknown> | null;
}

export function getProjects(): LocalProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    console.log("[projectStorage] Loaded projects:", parsed.length);
    return parsed;
  } catch {
    return [];
  }
}

export function saveProjects(projects: LocalProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  console.log("[projectStorage] Saved projects:", projects.length);
}

export function createProject(data: Omit<LocalProject, "createdAt" | "updatedAt" | "lastOpenedAt" | "editHistory" | "previewState" | "builderState">): LocalProject {
  const now = new Date().toISOString();
  const project: LocalProject = {
    ...data,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
    previewState: null,
    editHistory: [],
    builderState: null,
  };

  const projects = getProjects();
  // Insert at top
  projects.unshift(project);
  saveProjects(projects);
  console.log("[projectStorage] Created project:", project.projectId, project.projectName);
  return project;
}

export function updateProject(projectId: string, updates: Partial<LocalProject>) {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.projectId === projectId);
  if (idx === -1) {
    console.warn("[projectStorage] Project not found for update:", projectId);
    return null;
  }
  projects[idx] = { ...projects[idx], ...updates, updatedAt: new Date().toISOString() };
  saveProjects(projects);
  console.log("[projectStorage] Updated project:", projectId, updates);
  return projects[idx];
}

export function getProjectById(projectId: string): LocalProject | null {
  const projects = getProjects();
  return projects.find((p) => p.projectId === projectId) || null;
}

export function deleteProject(projectId: string) {
  const projects = getProjects().filter((p) => p.projectId !== projectId);
  saveProjects(projects);
  console.log("[projectStorage] Deleted project:", projectId);
}

export function setLastOpenedProject(projectId: string) {
  localStorage.setItem(LAST_OPENED_KEY, projectId);
}

export function getLastOpenedProject(): string | null {
  return localStorage.getItem(LAST_OPENED_KEY);
}
