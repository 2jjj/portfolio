import type { Project, Skill, SiteInfo, AboutData, GitHubRepo } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "";

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${API_URL}${endpoint}${separator}_t=${Date.now()}`;
  let res: Response;
  try {
    res = await fetch(url, { ...options, headers, cache: "no-store" });
  } catch {
    throw new Error("Nao foi possivel conectar ao servidor");
  }

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Sessao expirada");
  }

  const text = await res.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(text || "Erro na requisicao");
  }

  if (!res.ok) {
    throw new Error((data.error as string) || "Erro na requisicao");
  }

  return data as T;
}

export const api = {
  login: (password: string) =>
    request<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),

  projects: {
    list: () => request<Project[]>("/api/projects"),
    get: (id: number) => request<Project>(`/api/projects/${id}`),
    create: (data: Partial<Project>) =>
      request<Project>("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Project>) =>
      request<Project>(`/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ message: string }>(`/api/projects/${id}`, { method: "DELETE" }),
    updateOrder: (id: number, order_index: number) =>
      request<{ message: string }>(`/api/projects/${id}/order`, {
        method: "PUT",
        body: JSON.stringify({ order_index }),
      }),
  },

  about: {
    get: () => request<AboutData>("/api/about"),
    update: (data: { about_text?: string; about_secondary?: string }) =>
      request<{ message: string }>("/api/about", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  skills: {
    get: () => request<Skill[]>("/api/skills"),
    update: (skills: Skill[]) =>
      request<{ message: string }>("/api/skills", {
        method: "PUT",
        body: JSON.stringify({ skills }),
      }),
  },

  site: {
    get: () => request<SiteInfo & Record<string, string>>("/api/site"),
    update: (data: Partial<SiteInfo>) =>
      request<{ message: string }>("/api/site", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  github: {
    repos: (params: string = "") =>
      request<{ repos: GitHubRepo[]; total: number }>(`/api/github/repos${params}`),
    repo: (name: string) =>
      request<GitHubRepo>(`/api/github/repos/${encodeURIComponent(name)}`),
  },
};
