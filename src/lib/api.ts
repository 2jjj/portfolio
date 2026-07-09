const API_URL = import.meta.env.VITE_API_URL || "";

async function get<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) throw new Error(`Erro ao carregar dados`);
  return res.json();
}

export const api = {
  projects: {
    list: () => get<any[]>("/api/projects"),
  },
  about: {
    get: () => get<{ about_text: string; about_secondary: string }>("/api/about"),
  },
  skills: {
    get: () => get<any[]>("/api/skills"),
  },
  site: {
    get: () => get<any>("/api/site"),
  },
};
