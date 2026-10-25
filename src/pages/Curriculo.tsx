import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, Linkedin, Mail, MapPin, Printer } from "lucide-react";
import Footer from "@/components/Footer";
import { useAbout, useProjects, useSiteInfo, useSkills } from "@/hooks/use-public-api";

const Curriculo = () => {
  const { data: about } = useAbout();
  const { data: site } = useSiteInfo();
  const { data: skills } = useSkills();
  const { data: projects } = useProjects();

  useEffect(() => {
    document.title = "Currículo — Pedro Sakamoto";
  }, []);

  const groupedSkills = skills.reduce<Record<string, string[]>>((groups, skill) => {
    const category = skill.category || "Outros";
    groups[category] = [...(groups[category] || []), skill.title];
    return groups;
  }, {});

  const selectedProjects = projects.slice(0, 3);

  return (
    <>
      <header className="case-topbar">
        <Link to="/" className="navbar-brand" aria-label="Voltar para o início">
          PS.
        </Link>
        <div className="resume-topbar-actions">
          <Link to="/#projects" className="case-back">
            <ArrowLeft size={16} /> Projetos
          </Link>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} /> Salvar PDF
          </button>
        </div>
      </header>

      <main className="resume-page">
        <div className="section-inner">
          <div className="resume-header">
            <div>
              <div className="section-label">Currículo</div>
              <h1 className="resume-name">Pedro Sakamoto</h1>
              <p className="resume-role">{site.hero_phrases?.[0] || "Desenvolvedor Back-end"}</p>
            </div>
            <div className="resume-contact">
              <a href="mailto:pedrosakamoto27@gmail.com" className="resume-contact-item">
                <Mail size={16} /> pedrosakamoto27@gmail.com
              </a>
              <a href="https://github.com/2jjj" target="_blank" rel="noreferrer" className="resume-contact-item">
                <Github size={16} /> github.com/2jjj
              </a>
              <a
                href="https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/"
                target="_blank"
                rel="noreferrer"
                className="resume-contact-item"
              >
                <Linkedin size={16} /> linkedin.com/in/pedro-sakamoto
              </a>
              <span className="resume-contact-item">
                <MapPin size={16} /> Ribeirão Preto, SP
              </span>
            </div>
          </div>

          <section className="resume-section">
            <h2>Resumo</h2>
            <p>{about.about_text}</p>
            <p>{about.about_secondary}</p>
          </section>

          <section className="resume-section">
            <h2>Competências</h2>
            <div className="resume-skill-groups">
              {Object.entries(groupedSkills).map(([category, items]) => (
                <div key={category} className="resume-skill-group">
                  <span>{category}</span>
                  <p>{items.join(" · ")}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="resume-section">
            <h2>Projetos selecionados</h2>
            <div className="resume-projects">
              {selectedProjects.map((project) => (
                <article key={project.id} className="resume-project">
                  <div className="resume-project-head">
                    <h3>
                      <Link to={`/projetos/${project.slug || project.id}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <span>{project.category}</span>
                  </div>
                  <p>{project.summary || project.description}</p>
                  {project.tags?.length > 0 && (
                    <p className="resume-project-stack">{project.tags.join(" · ")}</p>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="resume-section resume-footer-section">
            <h2>Links</h2>
            <p>
              Portfólio: <strong>www.pedrosakamoto.site</strong> · API docs:{" "}
              <a href="/api/docs" target="_blank" rel="noreferrer">/api/docs</a>
            </p>
            <p className="resume-note">
              Currículo gerado a partir do portfólio. Use “Salvar PDF” para exportar.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Curriculo;
