import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";

const projects = [
  {
    title: "Resolute",
    description: "Bot para Discord verificado em mais de 1.000 servidores. Multi-funcionalidade com moderação, economia e entretenimento usando Node.js e MongoDB.",
    image: "https://static-www.adweek.com/wp-content/uploads/2021/07/DiscordLogo.jpg?w=890",
    tags: ["Discord.js", "Node.js", "MongoDB"],
    category: "backend",
    github: "https://github.com/2jjj/resolute",
    demo: null,
  },
  {
    title: "API Fetch Discord Info",
    description: "API REST escalável que entrega dados de usuários e servidores do Discord com arquitetura limpa e desempenho otimizado.",
    image: "https://irp.cdn-website.com/08ff45e1/dms3rep/multi/Banner-Principal-1920x1080px-1+%281%29.png",
    tags: ["Node.js", "Express", "REST API"],
    category: "backend",
    github: "https://github.com/2jjj/fetch_discord_info_site",
    demo: null,
  },
  {
    title: "Status Correios",
    description: "Front-end leve que consulta status em tempo real e mostra se os Correios estão em greve ou não.",
    image: "https://assets.b9.com.br/wp-content/uploads/2014/05/correios2.jpg",
    tags: ["React", "Vite"],
    category: "frontend",
    github: "https://github.com/2jjj/greve",
    demo: null,
  },
];

const categories = [
  { id: "all", label: "Todos" },
  { id: "frontend", label: "Front-End" },
  { id: "backend", label: "Back-End" },
  { id: "fullstack", label: "Full Stack" },
];

const categoryLabels: Record<string, string> = {
  backend: "Back-End",
  frontend: "Front-End",
  fullstack: "Full Stack",
};

const Projects = () => {
  const [filter, setFilter] = useState("all");
  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter);

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
                key={project.title}
                className="project-card"
                style={{ animationDelay: `${0.15 + index * 0.08}s` }}
              >
                <div className="project-image-wrapper">
                  <img src={project.image} alt={project.title} className="project-image" loading="lazy" />
                </div>
                <div className="project-content">
                  <div className="project-meta">
                    <span className="project-category">{categoryLabels[project.category] ?? project.category}</span>
                    <div className="project-tags">
                      {project.tags.map((tag) => (
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
                    {project.demo && (
                      <Button size="sm" className="flex-1" asChild>
                        <a href={project.demo} target="_blank" rel="noreferrer">
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
