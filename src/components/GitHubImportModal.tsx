import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, Star, GitFork, ExternalLink } from "lucide-react";
import { api } from "@/lib/admin-api";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  homepage: string;
  html_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  image: string;
}

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
      setRepos(data.repos.filter((r: GitHubRepo) => !r.name.includes("2jjj") || true));
    } catch (err: any) {
      setError(err.message || "Erro ao buscar repositórios");
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

  if (!open) return null;

  return (
    <div className="gh-modal-overlay" onClick={onClose}>
      <div className="gh-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gh-modal-header">
          <h2>Importar do GitHub</h2>
          <button className="admin-btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="gh-modal-search">
          <Search size={16} className="gh-search-icon" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar repositórios..."
          />
          {loading && <Loader2 size={16} className="gh-search-spinner animate-spin" />}
        </div>

        {error && <div className="admin-error">{error}</div>}

        <div className="gh-modal-list">
          {repos.length === 0 && !loading && (
            <div className="gh-modal-empty">
              {search ? "Nenhum repositório encontrado" : "Nenhum repositório disponível"}
            </div>
          )}
          {repos.map((repo) => (
            <button
              key={repo.id}
              className={`gh-repo-card ${selected?.id === repo.id ? "selected" : ""}`}
              onClick={() => setSelected(selected?.id === repo.id ? null : repo)}
            >
              <div className="gh-repo-header">
                <span className="gh-repo-name">{repo.name}</span>
                {repo.language && <span className="gh-repo-lang">{repo.language}</span>}
              </div>
              {repo.description && (
                <p className="gh-repo-desc">{repo.description}</p>
              )}
              <div className="gh-repo-meta">
                <span className="gh-repo-stat">
                  <Star size={12} /> {repo.stargazers_count}
                </span>
                <span className="gh-repo-stat">
                  <GitFork size={12} /> {repo.forks_count}
                </span>
                {repo.topics.length > 0 && (
                  <div className="gh-repo-topics">
                    {repo.topics.slice(0, 3).map((t) => (
                      <span key={t} className="gh-topic-tag">{t}</span>
                    ))}
                    {repo.topics.length > 3 && (
                      <span className="gh-topic-tag">+{repo.topics.length - 3}</span>
                    )}
                  </div>
                )}
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-repo-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </button>
          ))}
        </div>

        <div className="gh-modal-footer">
          <button className="admin-btn admin-btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="admin-btn" disabled={!selected} onClick={handleImport}>
            {selected ? `Importar "${formatName(selected.name)}"` : "Selecione um repositório"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GitHubImportModal;
