import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Download,
  Github,
  Globe,
  GraduationCap,
  Languages as LanguagesIcon,
  Link2,
  Linkedin,
  Mail,
  MapPin,
  Printer,
  Settings,
  Sparkles,
} from "lucide-react";
import Footer from "@/components/Footer";
import { useSiteInfo, useSkills } from "@/hooks/use-public-api";
import { DEFAULT_RESUME, DEFAULT_RESUME_EN } from "@/lib/resume-data";
import { auditResume } from "@/lib/resume-audit";
import type { ResumeData } from "@/types";

const ResumeSection = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="resume-section">
    <h2>
      <span className="resume-section-icon" aria-hidden="true">
        {icon}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

const mergeResume = (saved: ResumeData | undefined, fallback: ResumeData): ResumeData => {
  if (!saved) return fallback;
  return {
    ...fallback,
    ...saved,
    experiences: saved.experiences?.length ? saved.experiences : fallback.experiences,
    education: saved.education?.length ? saved.education : fallback.education,
    skills: saved.skills?.length ? saved.skills : fallback.skills,
    projects: saved.projects?.length ? saved.projects : fallback.projects,
    languages: saved.languages?.length ? saved.languages : fallback.languages,
  };
};

const Curriculo = () => {
  const [params, setParams] = useSearchParams();
  const lang = params.get("lang") === "en" ? "en" : "pt";
  const { data: site } = useSiteInfo();
  const { data: siteSkills } = useSkills();

  const resume = useMemo(() => {
    const fallback = lang === "en" ? DEFAULT_RESUME_EN : DEFAULT_RESUME;
    const saved = lang === "en" ? site.resume_data_en : site.resume_data;
    const merged = mergeResume(saved, fallback);
    if (!merged.skills.length && siteSkills.length) {
      return {
        ...merged,
        skills: siteSkills.map((skill) => ({ name: skill.title, category: skill.category })),
      };
    }
    return merged;
  }, [lang, site.resume_data, site.resume_data_en, siteSkills]);

  const audit = useMemo(() => auditResume(resume), [resume]);

  const education = resume.education[0];

  useEffect(() => {
    document.title =
      lang === "en" ? "Resume — Pedro Sakamoto" : "Currículo — Pedro Sakamoto";
  }, [lang]);

  const github = resume.github || "https://github.com/2jjj";
  const linkedin = resume.linkedin || "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/";
  const email = resume.email || "pedrosakamoto27@gmail.com";
  const siteUrl = (resume.site || site.site_url || "https://www.pedrosakamoto.site").replace(/\/$/, "");

  const labels =
    lang === "en"
      ? {
          label: "Resume",
          summary: "Summary",
          experience: "Experience",
          education: "Education",
          projects: "Selected projects",
          skills: "Skills",
          languages: "Languages",
          certifications: "Certifications",
          links: "Links",
          print: "Print / PDF",
          manage: "Manage",
          updated: "Updated",
          download: "Download PDF",
          back: "Projects",
          score: "ATS readiness",
        }
      : {
          label: "Currículo",
          summary: "Resumo",
          experience: "Experiência",
          education: "Formação",
          projects: "Projetos selecionados",
          skills: "Competências",
          languages: "Idiomas",
          certifications: "Certificações",
          links: "Links",
          print: "Imprimir / PDF",
          manage: "Gerenciar",
          updated: "Atualizado",
          download: "Baixar PDF",
          back: "Projetos",
          score: "Prontidão ATS",
        };

  const groupedSkills = resume.skills.reduce<Record<string, string[]>>((groups, skill) => {
    const category = skill.category || "Outros";
    groups[category] = [...(groups[category] || []), skill.name];
    return groups;
  }, {});

  const updated = resume.updatedAt
    ? new Date(resume.updatedAt).toLocaleDateString(lang === "en" ? "en-US" : "pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <>
      <header className="case-topbar">
        <Link to="/" className="navbar-brand" aria-label="Voltar para o início">
          PS.
        </Link>
        <div className="resume-topbar-actions">
          <Link to="/#projects" className="case-back">
            <ArrowLeft size={16} /> {labels.back}
          </Link>
          <div className="resume-lang-switch" role="group" aria-label="Idioma do currículo">
            <button
              type="button"
              className={lang === "pt" ? "active" : ""}
              onClick={() => setParams(lang === "pt" ? {} : { lang: "pt" })}
            >
              PT
            </button>
            <button
              type="button"
              className={lang === "en" ? "active" : ""}
              onClick={() => setParams({ lang: "en" })}
            >
              EN
            </button>
          </div>
          <a
            className="btn btn-outline"
            href={
              lang === "en"
                ? "/curriculo/resume-pedro-sakamoto-en.pdf"
                : "/curriculo/curriculo-pedro-sakamoto.pdf"
            }
            download
          >
            <Download size={16} /> {labels.download}
          </a>
          <Link to="/admin/curriculo" className="btn btn-outline resume-manage-btn">
            <Settings size={16} /> {labels.manage}
          </Link>
          <button
            type="button"
            className="btn btn-primary resume-print-btn"
            onClick={() => window.print()}
          >
            <Printer size={16} /> {labels.print}
          </button>
        </div>
      </header>

      <main className="resume-page">
        <div className="section-inner">
          <div className="resume-header">
            <div>
              <div className="section-label">{labels.label}</div>
              <h1 className="resume-name">{resume.name}</h1>
              <p className="resume-role">{resume.title}</p>
              {education && (
                <p className="resume-education">
                  <GraduationCap size={15} aria-hidden="true" />
                  <span>
                    {lang === "en"
                      ? `B.Sc. in Computer Engineering at ${education.institution.split(/\s[—–-]\s/)[0]} (in progress)`
                      : `Cursando Engenharia da Computação na ${education.institution.split(/\s[—–-]\s/)[0]}`}
                  </span>
                </p>
              )}
              {resume.targetRole && (
                <p className="resume-target">
                  <Sparkles size={14} aria-hidden="true" /> {resume.targetRole}
                </p>
              )}
            </div>
            <div className="resume-contact">
              <a href={`mailto:${email}`} className="resume-contact-item">
                <Mail size={16} /> {email}
              </a>
              <a href={github} target="_blank" rel="noreferrer" className="resume-contact-item">
                <Github size={16} /> {github.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
              <a href={linkedin} target="_blank" rel="noreferrer" className="resume-contact-item">
                <Linkedin size={16} />{" "}
                {linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </a>
              <span className="resume-contact-item">
                <MapPin size={16} /> {resume.location}
              </span>
              <span className="resume-contact-item resume-availability">
                <span className="hero-availability-dot" aria-hidden="true" />
                {site.availability || "Disponibilidade imediata"}
                {updated ? ` · ${labels.updated} ${updated}` : ""}
              </span>
            </div>
          </div>

          <div className="resume-highlights" aria-label="Resumo rápido">
            <div>
              <span>{labels.score}</span>
              <strong>{audit.score}/100</strong>
            </div>
            <div>
              <span>{labels.projects}</span>
              <strong>{resume.projects.length}</strong>
            </div>
            <div>
              <span>{labels.skills}</span>
              <strong>{resume.skills.length}</strong>
            </div>
            <div>
              <span>{labels.languages}</span>
              <strong>{resume.languages.length}</strong>
            </div>
          </div>

          {resume.summary && (
            <ResumeSection icon={<Sparkles size={15} />} title={labels.summary}>
              <p>{resume.summary}</p>
            </ResumeSection>
          )}

          {resume.experiences.length > 0 && (
            <ResumeSection icon={<Briefcase size={15} />} title={labels.experience}>
              <div className="resume-timeline">
                {resume.experiences.map((experience, index) => (
                  <article key={`${experience.company}-${index}`} className="resume-timeline-item">
                    <div className="resume-timeline-head">
                      <h3>{experience.role}</h3>
                      <span>
                        {[experience.startDate, experience.endDate || (lang === "en" ? "Present" : "Atual")]
                          .filter(Boolean)
                          .join(" – ")}
                      </span>
                    </div>
                    <p className="resume-timeline-company">
                      {experience.company}
                      {experience.location ? ` · ${experience.location}` : ""}
                    </p>
                    {experience.description && (
                      <ul className="resume-bullets">
                        {experience.description
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line, lineIndex) => (
                            <li key={lineIndex}>{line}</li>
                          ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </ResumeSection>
          )}

          {resume.education.length > 0 && (
            <ResumeSection icon={<GraduationCap size={15} />} title={labels.education}>
              <div className="resume-timeline">
                {resume.education.map((education, index) => (
                  <article key={`${education.institution}-${index}`} className="resume-timeline-item">
                    <div className="resume-timeline-head">
                      <h3>{education.degree}</h3>
                      <span>
                        {[education.startDate, education.endDate]
                          .filter(Boolean)
                          .join(" – ")}
                      </span>
                    </div>
                    <p className="resume-timeline-company">{education.institution}</p>
                    {education.description && <p>{education.description}</p>}
                  </article>
                ))}
              </div>
            </ResumeSection>
          )}

          {resume.projects.length > 0 && (
            <ResumeSection icon={<Award size={15} />} title={labels.projects}>
              <div className="resume-projects">
                {resume.projects.map((project, index) => (
                  <article key={`${project.name}-${index}`} className="resume-project">
                    <div className="resume-project-head">
                      <h3>
                        {project.link ? (
                          <a href={project.link} target="_blank" rel="noreferrer">
                            {project.name}
                          </a>
                        ) : (
                          project.name
                        )}
                      </h3>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <p>{project.description}</p>
                    {project.tech && <p className="resume-project-stack">{project.tech}</p>}
                  </article>
                ))}
              </div>
            </ResumeSection>
          )}

          {resume.skills.length > 0 && (
            <ResumeSection icon={<Sparkles size={15} />} title={labels.skills}>
              <div className="resume-skill-groups">
                {Object.entries(groupedSkills).map(([category, items]) => (
                  <div key={category} className="resume-skill-group">
                    <span>{category}</span>
                    <p>{items.join(" · ")}</p>
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          <div className="resume-columns">
            {resume.languages.length > 0 && (
              <ResumeSection icon={<LanguagesIcon size={15} />} title={labels.languages}>
                <ul className="resume-inline-list">
                  {resume.languages.map((language) => (
                    <li key={language.name}>
                      <strong>{language.name}</strong> {language.level}
                    </li>
                  ))}
                </ul>
              </ResumeSection>
            )}

            {resume.certifications.length > 0 && (
              <ResumeSection icon={<Award size={15} />} title={labels.certifications}>
                <ul className="resume-inline-list">
                  {resume.certifications.map((certification) => (
                    <li key={certification.name}>
                      <strong>{certification.name}</strong> {certification.issuer}
                    </li>
                  ))}
                </ul>
              </ResumeSection>
            )}
          </div>

          <section className="resume-section resume-footer-section">
            <h2>
              <span className="resume-section-icon" aria-hidden="true">
                <Link2 size={15} />
              </span>
              {labels.links}
            </h2>
            <ul className="resume-link-grid">
              <li>
                <Globe size={15} />
                <a href={siteUrl} target="_blank" rel="noreferrer">
                  {siteUrl.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </li>
              <li>
                <Github size={15} />
                <a href={github} target="_blank" rel="noreferrer">
                  {github.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </li>
              <li>
                <Linkedin size={15} />
                <a href={linkedin} target="_blank" rel="noreferrer">
                  {linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </li>
            </ul>
            <p className="resume-note">
              {lang === "en"
                ? "Generated from the live portfolio model. Use print to save a clean PDF."
                : "Gerado a partir do modelo ao vivo do portfólio. Use imprimir para salvar um PDF limpo."}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Curriculo;
