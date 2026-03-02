import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Project[];
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
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: input.name,
          prompt: input.prompt,
          mode: input.mode,
          single_language: input.single_language ?? null,
          multi_stack: input.multi_stack ?? { frontend: [], backend: [], database: [] },
          status: input.status ?? "generating",
        } as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", user?.id] });
    },
  });
}
