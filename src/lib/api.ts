const API_URL = import.meta.env.VITE_API_URL || "";

async function get<T>(endpoint: string): Promise<T> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${API_URL}${endpoint}${separator}_t=${Date.now()}`;
  console.log(`[API] Fetching: ${url}`);
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
