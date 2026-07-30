import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Project, Skill, SiteInfo, AboutData } from "@/types";

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => api.projects.list(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useAbout() {
  return useQuery<AboutData>({
    queryKey: ["about"],
    queryFn: () => api.about.get(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: () => api.skills.get(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useSiteInfo() {
  return useQuery<SiteInfo & Record<string, string>>({
    queryKey: ["site-info"],
    queryFn: () => api.site.get(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
