import type { Project, Skill, SiteInfo, AboutData } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "";

async function get<T>(endpoint: string): Promise<T> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${API_URL}${endpoint}${separator}_t=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[API] Error ${res.status}: ${text}`);
    throw new Error(`Erro ao carregar dados (${res.status})`);
  }
  return res.json();
}

export const api = {
  projects: {
    list: () => get<Project[]>("/api/projects"),
  },
  about: {
    get: () => get<AboutData>("/api/about"),
  },
  skills: {
    get: () => get<Skill[]>("/api/skills"),
  },
  site: {
    get: () => get<SiteInfo & Record<string, string>>("/api/site"),
  },
};
