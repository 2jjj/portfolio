import { BookOpen, ExternalLink, Github } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/use-public-api";
import { Skeleton } from "@/components/ui/skeleton";

function projectHref(project: { slug?: string; id: number }) {
  return `/projetos/${project.slug || project.id}`;
}

const categories = [
  { id: "all", label: "Todos" },
  { id: "Front-End", label: "Front-End" },
  { id: "Back-End", label: "Back-End" },
  { id: "Full Stack", label: "Full Stack" },
];

const categoryColors: Record<string, string> = {
  "Front-End": "#00D4FF",
  "Back-End": "#FF6B35",
  "Full Stack": "#7B2FFF",
};

function ProjectSkeleton() {
  return (
    <div className="project-card" style={{ animation: "none", opacity: 1, transform: "none" }}>
      <Skeleton className="h-48 w-full rounded-t-xl" />
      <div className="project-content">
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

const Projects = () => {
  const { data: projects, isLoading } = useProjects();
  const [filter, setFilter] = useState("all");

  const filteredProjects = !projects ? [] : filter === "all"
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <div className="section-label">Projetos</div>
        <h2 className="section-title marker-fill">
          Trabalhos <span>recentes</span>
        </h2>
        <p className="section-copy">
          Coisas que eu construí e que rodaram de verdade — bot vendido pra uma loja, SaaS com
          checkout, bot de Discord, extensão de Chrome. Cada card abre o case com as telas, as
          decisões e o que eu faria diferente hoje.
        </p>

        <div className="project-filters">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`filter-btn ${filter === category.id ? "active" : ""}`}
              onClick={() => setFilter(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ProjectSkeleton key={i} />)
          ) : filteredProjects.length === 0 ? (
            <p className="projects-empty">
              Nenhum projeto encontrado para esta categoria.
            </p>
          ) : (
            filteredProjects.map((project, index) => (
              <div
                key={project.id || project.title}
                className="project-card"
                data-reveal
                style={
                  {
                    animationDelay: `${0.1 + index * 0.08}s`,
                    "--reveal-delay": `${Math.min(index, 6) * 70}ms`,
                  } as CSSProperties
                }
              >
                <span className="project-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link
                  to={projectHref(project)}
                  className="project-image-wrapper"
                  aria-label={`Ver case study de ${project.title}`}
                >
                  <div className="project-image-overlay" />
                  {project.image && project.image !== "/placeholder.svg" ? (
                    <img
                      src={project.image}
                      alt={`Prévia do projeto ${project.title}`}
                      className="project-image"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        const image = event.currentTarget;
                        if (image.dataset.fallback === "1") return;
                        image.dataset.fallback = "1";
                        image.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="project-image project-image-fallback">
                      <span>{project.title}</span>
                    </div>
                  )}
                </Link>
                <div className="project-content">
                  <div className="project-meta">
                    <span
                      className="project-category"
                      style={{ color: categoryColors[project.category] ?? "#fff" }}
                    >
                      {project.category}
                    </span>
                    {project.contextLabel && (
                      <span className="project-context">{project.contextLabel}</span>
                    )}
                    {project.tags?.length > 0 && (
                      <div className="project-tags">
                        {project.tags.map((tag: string) => (
                          <span key={tag} className="project-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <h3 className="project-title">
                    <Link to={projectHref(project)} className="project-title-link">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-actions">
                    <Link to={projectHref(project)} className="project-link-btn primary">
                      <BookOpen size={16} /> Case
                    </Link>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="project-link-btn">
                        <Github size={16} /> Código
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer" className="project-link-btn">
                        <ExternalLink size={16} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
