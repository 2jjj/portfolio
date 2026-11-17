import type { Project, Skill, SiteInfo, AboutData, GitHubRepo, JobResult, JobSearchResponse, JobStatus, SavedJob } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "";

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

function setToken(token: string) {
  localStorage.setItem("admin_token", token);
}

function clearToken() {
  localStorage.removeItem("admin_token");
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        clearToken();
        return false;
      }
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        return true;
      }
      return false;
    } catch {
      clearToken();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  return refreshPromise;
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
    res = await fetch(url, { ...options, headers, credentials: "include", cache: "no-store" });
  } catch {
    throw new Error("Nao foi possivel conectar ao servidor");
  }

  if (res.status === 401 || res.status === 403) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const newToken = getToken();
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers, credentials: "include", cache: "no-store" });
    } else {
      clearToken();
      window.location.href = "/admin/login";
      throw new Error("Sessao expirada");
    }
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
      credentials: "include",
    }).then((data) => {
      if (data.token) setToken(data.token);
      return data;
    }),

  logout: () =>
    request<{ message: string }>("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => clearToken()),

  projects: {
    list: (params?: { page?: number; limit?: number; category?: string; search?: string; featured?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.category) searchParams.set("category", params.category);
      if (params?.search) searchParams.set("search", params.search);
      if (params?.featured !== undefined) searchParams.set("featured", String(params.featured));
      const qs = searchParams.toString();
      return request<{ data: Project[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean } }>(
        `/api/projects${qs ? `?${qs}` : ""}`
      );
    },
    listAll: () => request<Project[]>("/api/projects/all"),
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

  jobs: {
    search: (params: {
      q?: string;
      location?: string;
      remote?: boolean;
      sources?: string[];
      limit?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.set("q", params.q);
      if (params.location) searchParams.set("location", params.location);
      if (params.remote) searchParams.set("remote", "1");
      if (params.sources?.length) searchParams.set("sources", params.sources.join(","));
      if (params.limit) searchParams.set("limit", String(params.limit));
      return request<JobSearchResponse>(`/api/jobs/search${searchParams.toString() ? `?${searchParams}` : ""}`);
    },
    saved: {
      list: (status?: JobStatus) =>
        request<SavedJob[]>(`/api/jobs/saved${status ? `?status=${status}` : ""}`),
      create: (job: JobResult) =>
        request<SavedJob>("/api/jobs/saved", {
          method: "POST",
          body: JSON.stringify({
            source: job.source,
            external_id: job.id,
            title: job.title,
            company: job.company,
            url: job.url,
            apply_url: job.applyUrl,
            location: job.location,
            remote: job.remote,
            salary: job.salary,
            tags: job.tags,
            description: job.description,
            match_score: job.matchScore,
            matched_skills: job.matchedSkills,
            missing_skills: job.missingSkills,
            top_projects: job.topProjects,
          }),
        }),
      update: (id: number, data: { status?: JobStatus; notes?: string; next_action_at?: string | null }) =>
        request<SavedJob>(`/api/jobs/saved/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        }),
      remove: (id: number) =>
        request<{ message: string }>(`/api/jobs/saved/${id}`, { method: "DELETE" }),
      events: (id: number) =>
        request<Array<{ id: number; from_status: string | null; to_status: string; note: string; created_at: string }>>(
          `/api/jobs/saved/${id}/events`
        ),
    },
  },
};
