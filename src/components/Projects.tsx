import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.projects.list().then(setProjects).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filteredProjects = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <div className="section-label">Projetos</div>
        <h2 className="section-title">
          Trabalhos <span>recentes</span>
        </h2>
        <p className="section-copy reveal" style={{ animationDelay: "0.1s" }}>
          Projetos que demonstram minha experiência em back-end, APIs escaláveis e integrações confiáveis.
        </p>

        <div className="project-filters reveal" style={{ animationDelay: "0.2s" }}>
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
          {filteredProjects.length === 0 ? (
            <p className="projects-empty" style={{ animationDelay: "0.15s" }}>
              Nenhum projeto encontrado para esta categoria.
            </p>
          ) : (
            filteredProjects.map((project, index) => (
              <Card
                key={project.id || project.title}
                className="project-card"
                style={{ animationDelay: `${0.15 + index * 0.08}s` }}
              >
                <div className="project-image-wrapper">
                  <img src={project.image} alt={project.title} className="project-image" loading="lazy" />
                </div>
                <div className="project-content">
                  <div className="project-meta">
                    <span className="project-category" style={{ color: categoryColors[project.category] ?? "#fff" }}>
                      {project.category}
                    </span>
                    <div className="project-tags">
                      {project.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="project-tag">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-actions">
                    {project.github && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.github} target="_blank" rel="noreferrer">
                          <Github className="mr-2 h-4 w-4" /> GitHub
                        </a>
                      </Button>
                    )}
                    {project.live && (
                      <Button size="sm" className="flex-1" asChild>
                        <a href={project.live} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
