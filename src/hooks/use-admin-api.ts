import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/admin-api";
import type { Project, Skill } from "@/types";
import { toast } from "sonner";

export function useAdminProjects(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["admin", "projects", { page, limit }],
    queryFn: () => api.projects.list({ page, limit }),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 2,
  });
}

export function useAdminProjectsAll() {
  return useQuery<Project[]>({
    queryKey: ["admin", "projects", "all"],
    queryFn: () => api.projects.listAll(),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 2,
  });
}

export function useAdminProject(id: number) {
  return useQuery<Project>({
    queryKey: ["admin", "projects", id],
    queryFn: () => api.projects.get(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Project>) => api.projects.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto criado com sucesso!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao criar projeto");
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) =>
      api.projects.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto atualizado com sucesso!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao atualizar projeto");
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.projects.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto removido com sucesso!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao remover projeto");
    },
  });
}

export function useUpdateProjectOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, order_index }: { id: number; order_index: number }) =>
      api.projects.updateOrder(id, order_index),
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao salvar ordem");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
    },
  });
}

export function useAdminSkills() {
  return useQuery<Skill[]>({
    queryKey: ["admin", "skills"],
    queryFn: () => api.skills.get(),
    staleTime: 1000 * 30,
  });
}

export function useUpdateSkills() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (skills: Skill[]) => api.skills.update(skills),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "skills"] });
      qc.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skills salvas com sucesso!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao salvar skills");
    },
  });
}

export function useAdminAbout() {
  return useQuery({
    queryKey: ["admin", "about"],
    queryFn: () => api.about.get(),
    staleTime: 1000 * 30,
  });
}

export function useUpdateAbout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { about_text?: string; about_secondary?: string }) =>
      api.about.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "about"] });
      qc.invalidateQueries({ queryKey: ["about"] });
      toast.success("Informacoes atualizadas!");
    },
  });
}

export function useAdminSite() {
  return useQuery({
    queryKey: ["admin", "site"],
    queryFn: () => api.site.get(),
    staleTime: 1000 * 30,
  });
}

export function useUpdateSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.site.update(data as never),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "site"] });
      qc.invalidateQueries({ queryKey: ["site-info"] });
      toast.success("Site atualizado!");
    },
  });
}
