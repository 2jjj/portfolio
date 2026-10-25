import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Github,
  Layers,
  User,
} from "lucide-react";
import Footer from "@/components/Footer";
import { useProjects } from "@/hooks/use-public-api";

const ProjectDetail = () => {
  const { slug } = useParams();
  const { data: projects, isLoading } = useProjects();
  const project = projects.find(
    (item) => item.slug === slug || String(item.id) === slug
  );

  useEffect(() => {
    document.title = project
      ? `${project.title} — Case study | Pedro Sakamoto`
      : "Projeto não encontrado | Pedro Sakamoto";
  }, [project]);

  if (isLoading) {
    return (
      <main className="case-page">
        <div className="section-inner">
          <div className="case-skeleton" />
          <div className="case-skeleton case-skeleton-short" />
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="case-page">
        <div className="section-inner case-empty">
          <div className="section-label">Case study</div>
          <h1 className="case-title">Projeto não encontrado</h1>
          <p className="case-summary">
            Esse case não existe ou foi removido. Veja os projetos disponíveis.
          </p>
          <Link to="/#projects" className="btn btn-primary">
            <ArrowLeft size={18} /> Voltar para projetos
          </Link>
        </div>
      </main>
    );
  }

  const sections = [
    { label: "01", title: "Problema", text: project.problem },
    { label: "02", title: "Arquitetura", text: project.architecture },
    { label: "03", title: "Decisões", text: project.decisions },
    { label: "04", title: "Resultado", text: project.results },
  ].filter((section) => section.text);

  const metrics = project.metrics || [];
  const stack = project.tags || [];
  const showCover =
    Boolean(project.image) &&
    project.image !== "/placeholder.svg" &&
    !project.image?.startsWith("https://opengraph.githubassets.com/");

  return (
    <>
      <header className="case-topbar">
        <Link to="/" className="navbar-brand" aria-label="Voltar para o início">
          PS.
        </Link>
        <Link to="/#projects" className="case-back">
          <ArrowLeft size={16} /> Projetos
        </Link>
      </header>

      <main className="case-page">
        <div className="section-inner">
          <div className="case-hero">
            <div className="case-hero-copy">
              <div className="section-label">Case study</div>
              <h1 className="case-title">{project.title}</h1>
              <p className="case-summary">
                {project.summary || project.description}
              </p>

              {stack.length > 0 && (
                <div className="case-tags">
                  {stack.map((tag) => (
                    <span key={tag} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="case-actions">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                  >
                    <Github size={18} /> Código
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    <ArrowUpRight size={18} /> Ver demo
                  </a>
                )}
              </div>
            </div>

            <aside className="case-meta-card">
              <div className="case-meta-item">
                <User size={18} />
                <span>Papel</span>
                <strong>{project.role || "Autor"}</strong>
              </div>
              <div className="case-meta-item">
                <Calendar size={18} />
                <span>Período</span>
                <strong>{project.timeline || "2026"}</strong>
              </div>
              <div className="case-meta-item">
                <Layers size={18} />
                <span>Stack</span>
                <strong>{stack.length > 0 ? stack.join(" · ") : "—"}</strong>
              </div>
            </aside>
          </div>

          {showCover ? (
            <div className="case-cover-wrapper">
              <img
                src={project.image}
                alt={`Capa do projeto ${project.title}`}
                className="case-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          ) : (
            <div className="case-cover-placeholder">
              <span>{project.category || "Case study"}</span>
              <strong>{project.title}</strong>
              <small>{stack.length > 0 ? stack.join(" · ") : "Back-end"}</small>
            </div>
          )}

          {metrics.length > 0 && (
            <div className="case-metrics">
              {metrics.map((metric) => (
                <div key={metric.label} className="case-metric">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          )}

          <div className="case-body">
            {sections.length > 0 ? (
              sections.map((section) => (
                <section key={section.title} className="case-section">
                  <span className="case-section-label">{section.label}</span>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                </section>
              ))
            ) : (
              <section className="case-section">
                <span className="case-section-label">01</span>
                <h2>Visão geral</h2>
                <p>{project.description}</p>
                <p className="case-note">
                  Case study detalhado em construção. O código está disponível
                  acima.
                </p>
              </section>
            )}
          </div>

          <div className="case-footer">
            <Link to="/#projects" className="case-back">
              <ArrowLeft size={16} /> Ver todos os projetos
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetail;

