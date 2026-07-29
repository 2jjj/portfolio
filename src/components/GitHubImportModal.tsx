import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Star, GitFork, ExternalLink } from "lucide-react";
import { api } from "@/lib/admin-api";
import type { GitHubRepo } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface GitHubImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    image: string;
    github: string;
    live: string;
  }) => void;
}

const languageToCategory: Record<string, string> = {
  TypeScript: "Front-End",
  JavaScript: "Full Stack",
  HTML: "Front-End",
  CSS: "Front-End",
  SCSS: "Front-End",
  React: "Front-End",
  Vue: "Front-End",
  Svelte: "Front-End",
  Python: "Back-End",
  Java: "Back-End",
  Go: "Back-End",
  Rust: "Back-End",
  Ruby: "Back-End",
  PHP: "Back-End",
  C: "Back-End",
  "C++": "Back-End",
  "C#": "Back-End",
  Dart: "Mobile",
  Kotlin: "Mobile",
  Swift: "Mobile",
  Shell: "DevOps",
  Dockerfile: "DevOps",
  Terraform: "DevOps",
  YAML: "DevOps",
};

function detectCategory(language: string | null, topics: string[]): string {
  if (language && languageToCategory[language]) return languageToCategory[language];

  const allText = [...topics, language || ""].join(" ").toLowerCase();
  if (allText.includes("mobile") || allText.includes("flutter") || allText.includes("react-native"))
    return "Mobile";
  if (allText.includes("devops") || allText.includes("docker") || allText.includes("ci/cd") || allText.includes("infra"))
    return "DevOps";
  if (allText.includes("frontend") || allText.includes("react") || allText.includes("vue") || allText.includes("angular"))
    return "Front-End";
  if (allText.includes("backend") || allText.includes("api") || allText.includes("server"))
    return "Back-End";

  return "Full Stack";
}

function formatName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const GitHubImportModal = ({ open, onClose, onImport }: GitHubImportModalProps) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<GitHubRepo | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) {
      fetchRepos("");
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSelected(null);
      setSearch("");
      setRepos([]);
      setError("");
    }
  }, [open]);

  const fetchRepos = async (q: string) => {
    setLoading(true);
    setError("");
    try {
      const params = q ? `?search=${encodeURIComponent(q)}` : "";
      const data = await api.github.repos(params);
      setRepos(data.repos);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao buscar repositorios");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchRepos(value), 400);
  };

  const handleImport = () => {
    if (!selected) return;
    const category = detectCategory(selected.language, selected.topics);
    const tags = [
      ...(selected.language ? [selected.language] : []),
      ...selected.topics.slice(0, 5),
    ];

    onImport({
      title: formatName(selected.name),
      description: selected.description || `Projeto ${formatName(selected.name)}`,
      category,
      tags,
      image: selected.image,
      github: selected.html_url,
      live: selected.homepage || "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[640px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-5 pb-3 border-b border-border">
          <DialogTitle>Importar do GitHub</DialogTitle>
        </DialogHeader>

        <div className="relative px-5 py-3 border-b border-border">
          <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar repositorios..."
            className="w-full pl-8 pr-8 py-2 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-cyan-500 transition-colors"
          />
          {loading && <Loader2 size={16} className="absolute right-7 top-1/2 -translate-y-1/2 text-cyan-400 animate-spin" />}
        </div>

        {error && <p className="px-5 pt-2 text-sm text-red-400">{error}</p>}

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 max-h-[50vh]">
          {repos.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-8 text-sm">
              {search ? "Nenhum repositorio encontrado" : "Nenhum repositorio disponivel"}
            </div>
          )}
          {repos.map((repo) => (
            <button
              key={repo.id}
              type="button"
              className={`w-full text-left flex flex-col gap-2 p-3 rounded-lg border transition-colors cursor-pointer font-inherit ${
                selected?.id === repo.id
                  ? "border-cyan-500 bg-cyan-500/5"
                  : "border-border bg-transparent hover:border-border-hover hover:bg-muted/20"
              }`}
              onClick={() => setSelected(selected?.id === repo.id ? null : repo)}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">{repo.name}</span>
                {repo.language && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">{repo.language}</span>
                )}
              </div>
              {repo.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{repo.description}</p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Star size={12} /> {repo.stargazers_count}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <GitFork size={12} /> {repo.forks_count}
                </span>
                {repo.topics.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {repo.topics.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>
                    ))}
                    {repo.topics.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">+{repo.topics.length - 3}</span>
                    )}
                  </div>
                )}
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-muted-foreground hover:text-cyan-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Abrir no GitHub"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </button>
          ))}
        </div>

        <DialogFooter className="p-4 border-t border-border">
          <DialogClose asChild>
            <button type="button" className="admin-btn admin-btn-ghost">Cancelar</button>
          </DialogClose>
          <button type="button" className="admin-btn" disabled={!selected} onClick={handleImport}>
            {selected ? `Importar "${formatName(selected.name)}"` : "Selecione um repositorio"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubImportModal;
