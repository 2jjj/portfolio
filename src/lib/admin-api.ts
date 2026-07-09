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
  const res = await fetch(url, { ...options, headers, cache: "no-store" });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Sessão expirada");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erro na requisição");
  }

  return data;
}

export const api = {
  login: (password: string) =>
    request<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),

  projects: {
    list: () => request<any[]>("/api/projects"),
    get: (id: number) => request<any>(`/api/projects/${id}`),
    create: (data: any) =>
      request<any>("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      request<any>(`/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<any>(`/api/projects/${id}`, { method: "DELETE" }),
  },

  about: {
    get: () => request<{ about_text: string; about_secondary: string }>("/api/about"),
    update: (data: { about_text?: string; about_secondary?: string }) =>
      request<any>("/api/about", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  skills: {
    get: () => request<any[]>("/api/skills"),
    update: (skills: any[]) =>
      request<any>("/api/skills", {
        method: "PUT",
        body: JSON.stringify({ skills }),
      }),
  },

  site: {
    get: () => request<any>("/api/site"),
    update: (data: any) =>
      request<any>("/api/site", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
};
