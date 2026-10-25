import { ArrowUpRight, GitFork, Github, Star } from "lucide-react";
import { useGitHubRepos } from "@/hooks/use-public-api";

const GitHubSection = () => {
  const { data: repos } = useGitHubRepos();

  if (repos.length === 0) return null;

  return (
    <section id="github" className="section">
      <div className="section-inner">
        <div className="section-label">Open source</div>
        <h2 className="section-title marker-fill">
          Código no <span>GitHub</span>
        </h2>
        <p className="section-copy">
          Repositórios públicos que mostram como eu penso: APIs pequenas,
          ferramentas de linha de comando e projetos full stack.
        </p>

        <div className="github-grid">
          {repos.slice(0, 4).map((repo, index) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="github-card"
              style={{ animationDelay: `${0.05 + index * 0.06}s` }}
            >
              <div className="github-card-head">
                <Github size={18} />
                <span>{repo.name}</span>
                <ArrowUpRight size={16} className="github-card-arrow" />
              </div>
              <p>{repo.description || "Repositório público no GitHub."}</p>
              <div className="github-meta">
                <span>{repo.language || "Código"}</span>
                <span>
                  <Star size={13} /> {repo.stargazers_count}
                </span>
                <span>
                  <GitFork size={13} /> {repo.forks_count}
                </span>
              </div>
            </a>
          ))}
        </div>

        <a
          href="https://github.com/2jjj"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline github-all"
        >
          <Github size={16} /> Ver todos os repositórios
        </a>
      </div>
    </section>
  );
};

export default GitHubSection;

