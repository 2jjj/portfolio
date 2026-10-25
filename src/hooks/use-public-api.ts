import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  FALLBACK_ABOUT,
  FALLBACK_GITHUB_REPOS,
  FALLBACK_PROJECTS,
  FALLBACK_SITE,
  FALLBACK_SKILLS,
} from "@/lib/fallback";
import type { Project, Skill, SiteInfo, AboutData, GitHubRepo } from "@/types";

export function useProjects() {
  const query = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => api.projects.list(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    ...query,
    data: query.data ?? FALLBACK_PROJECTS,
    isFallback: query.isError,
  };
}

export function useAbout() {
  const query = useQuery<AboutData>({
    queryKey: ["about"],
    queryFn: () => api.about.get(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    ...query,
    data: query.data ?? FALLBACK_ABOUT,
    isFallback: query.isError,
  };
}

export function useSkills() {
  const query = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: () => api.skills.get(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    ...query,
    data: query.data ?? FALLBACK_SKILLS,
    isFallback: query.isError,
  };
}

export function useSiteInfo() {
  const query = useQuery<SiteInfo>({
    queryKey: ["site-info"],
    queryFn: () => api.site.get(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    ...query,
    data: query.data ?? FALLBACK_SITE,
    isFallback: query.isError,
  };
}

export function useGitHubRepos() {
  const query = useQuery<GitHubRepo[]>({
    queryKey: ["github-public"],
    queryFn: () => api.github.publicRepos(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });

  return {
    ...query,
    data: query.data && query.data.length > 0 ? query.data : FALLBACK_GITHUB_REPOS,
    isFallback: query.isError,
  };
}
