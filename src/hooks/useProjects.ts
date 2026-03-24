import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { mergeProjects, readLocalProjects, upsertLocalProject, type PersistedProject } from "@/lib/projectPersistence";

export interface Project {
  id: string;
  user_id: string;
  name: string;
  prompt: string | null;
  mode: string;
  single_language: string | null;
  multi_stack: { frontend: string[]; backend: string[]; database: string[] } | null;
  status: string;
  preview_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async (): Promise<Project[]> => {
      if (!user) return [];
      const localProjects = readLocalProjects(user.id);

      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("[useProjects] Failed to load projects:", error);
          console.log("Projects loaded", localProjects.length);
          return localProjects as Project[];
        }

        const mergedProjects = mergeProjects(
          ((data ?? []) as unknown as PersistedProject[]),
          localProjects,
        );

        console.log("Projects loaded", mergedProjects.length);
        return mergedProjects as Project[];
      } catch (error) {
        console.error("[useProjects] Failed to load projects:", error);
        console.log("Projects loaded", localProjects.length);
        return localProjects as Project[];
      }
    },
    enabled: !!user,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      prompt: string;
      mode: string;
      single_language?: string | null;
      multi_stack?: { frontend: string[]; backend: string[]; database: string[] };
      status?: string;
    }) => {
      if (!user?.id) {
        console.error("Project save failed: userId is missing");
        throw new Error("User not authenticated");
      }

      const timestamp = new Date().toISOString();
      const projectData: PersistedProject = {
        id: crypto.randomUUID(),
        user_id: user.id,
        name: input.name,
        prompt: input.prompt,
        mode: input.mode,
        single_language: input.single_language ?? null,
        multi_stack: input.multi_stack ?? { frontend: [], backend: [], database: [] },
        status: input.status ?? "generating",
        preview_url: null,
        created_at: timestamp,
        updated_at: timestamp,
        last_opened_at: timestamp,
        repo_url: null,
        share_url: null,
        builder_state: null,
      };

      console.log("User ID:", user.id);
      console.log("Project before save:", projectData);

      try {
        const { data, error } = await supabase
          .from("projects")
          .insert(projectData)
          .select()
          .single();

        if (error) {
          throw error;
        }

        const savedProject = data as unknown as PersistedProject;
        upsertLocalProject(user.id, savedProject);
        console.log("Project created", savedProject.id);
        console.log("Project saved successfully");
        return savedProject as Project;
      } catch (error) {
        console.error("Project save failed:", error);

        try {
          upsertLocalProject(user.id, projectData);
          console.log("Project saved successfully");
          return projectData as Project;
        } catch (storageError) {
          console.error("Project save failed:", storageError);
          throw new Error("Project could not be saved");
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", user?.id] });
    },
  });
}
