import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  CheckCircle2,
  ClipboardCopy,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  GraduationCap,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminSite, useUpdateSite } from "@/hooks/use-admin-api";
import { api } from "@/lib/admin-api";
import { DEFAULT_RESUME, DEFAULT_RESUME_EN } from "@/lib/resume-data";
import { auditResume, buildResumePrompt, resumeToText } from "@/lib/resume-audit";
import type {
  Certification,
  Education,
  Experience,
  Language,
  ResumeData,
  ResumeProject,
  ResumeSkill,
} from "@/types";

type DocLang = "pt" | "en";
type Tab = "conteudo" | "analise" | "exportar";

const emptyExperience = (): Experience => ({
  role: "",
  company: "",
  startDate: "",
  endDate: "",
  location: "",
  description: "",
});
const emptyEducation = (): Education => ({
  degree: "",
  institution: "",
  startDate: "",
  endDate: "",
  description: "",
});
const emptySkill = (): ResumeSkill => ({ name: "", category: "Back-End" });
const emptyProject = (): ResumeProject => ({ name: "", description: "", tech: "", link: "" });
const emptyLanguage = (): Language => ({ name: "", level: "IntermediÃ¡rio" });
const emptyCertification = (): Certification => ({ name: "", issuer: "", date: "" });

const skillCategories = [
  "Back-End",
  "Front-End",
  "Linguagem",
  "Banco de Dados",
  "DevOps",
  "Qualidade",
  "Ferramentas",
  "Outro",
];
const languageLevels = [
  "BÃ¡sico",
  "IntermediÃ¡rio",
  "AvanÃ§ado",
  "Fluente",
  "Nativo",
];

const API_URL = import.meta.env.VITE_API_URL || "";

function asResume(value: unknown, fallback: ResumeData): ResumeData {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<ResumeData>;
  return {
    ...fallback,
    ...candidate,
    experiences: candidate.experiences?.length ? candidate.experiences : fallback.experiences,
    education: candidate.education?.length ? candidate.education : fallback.education,
    skills: candidate.skills?.length ? candidate.skills : fallback.skills,
    projects: candidate.projects?.length ? candidate.projects : fallback.projects,
    languages: candidate.languages?.length ? candidate.languages : fallback.languages,
    certifications: candidate.certifications ?? fallback.certifications,
  };
}

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  full,
  textarea,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  full?: boolean;
  textarea?: boolean;
  rows?: number;
  hint?: string;
}) => (
  <div className={`admin-field${full ? " admin-field-full" : ""}`}>
    <label>{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    ) : (
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    )}
    {hint && <span className="admin-field-hint">{hint}</span>}
  </div>
);

const ItemCard = ({
  index,
  title,
  onRemove,
  children,
}: {
  index: number;
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) => (
  <div className="resume-item-card">
    <div className="resume-item-header">
      <span className="resume-item-number">
        {String(index + 1).padStart(2, "0")} Â· {title}
      </span>
      <button type="button" className="admin-btn-icon danger" onClick={onRemove} aria-label="Remover">
        <Trash2 size={13} />
      </button>
    </div>
    {children}
  </div>
);

const AdminResume = () => {
  const { toast } = useToast();
  const { data: siteInfo, isLoading } = useAdminSite();
  const updateSite = useUpdateSite();

  const [docs, setDocs] = useState<Record<DocLang, ResumeData>>({
    pt: DEFAULT_RESUME,
    en: DEFAULT_RESUME_EN,
  });
  const [lang, setLang] = useState<DocLang>("pt");
  const [tab, setTab] = useState<Tab>("conteudo");
  const [loading, setLoading] = useState(false);
  const [autofilling, setAutofilling] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [copied, setCopied] = useState<"prompt" | "text" | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteInfo) return;
    setDocs({
      pt: asResume(siteInfo.resume_data, DEFAULT_RESUME),
      en: asResume(siteInfo.resume_data_en, DEFAULT_RESUME_EN),
    });
  }, [siteInfo]);

  const data = docs[lang];
  const audit = useMemo(() => auditResume(data), [data]);

  const setData = (updater: (previous: ResumeData) => ResumeData) => {
    setDocs((previous) => ({ ...previous, [lang]: updater(previous[lang]) }));
  };

  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((previous) => ({ ...previous, [key]: value }));
  };

  const addToArray = <T,>(key: keyof ResumeData, empty: () => T) => {
    setData((previous) => ({
      ...previous,
      [key]: [...(previous[key] as unknown[]), empty()],
    }));
  };

  const removeFromArray = (key: keyof ResumeData, index: number) => {
    setData((previous) => ({
      ...previous,
      [key]: (previous[key] as unknown[]).filter((_, position) => position !== index),
    }));
  };

  const updateArrayItem = (key: keyof ResumeData, index: number, field: string, value: string) => {
    setData((previous) => {
      const array = [...(previous[key] as unknown as Record<string, string>[])];
      array[index] = { ...array[index], [field]: value };
      return { ...previous, [key]: array };
    });
  };

  const save = () => {
    const now = new Date().toISOString();
    updateSite.mutate({
      resume_data: { ...docs.pt, updatedAt: now },
      resume_data_en: { ...docs.en, updatedAt: now },
    });
  };

  const autofill = async () => {
    setAutofilling(true);
    try {
      const [skills, projects] = await Promise.all([api.skills.get(), api.projects.listAll()]);
      const mappedSkills: ResumeSkill[] = skills.map((skill) => ({
        name: skill.title,
        category: skill.category || "Outro",
      }));
      const mappedProjects: ResumeProject[] = projects.slice(0, 6).map((project) => ({
        name: project.title,
        description: project.summary || project.description,
        tech: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "",
        link: project.live || project.github || "",
      }));

      setData((previous) => ({
        ...previous,
        skills: mappedSkills.length ? mappedSkills : previous.skills,
        projects: mappedProjects.length ? mappedProjects : previous.projects,
        email: siteInfo?.public_email || previous.email,
        github: siteInfo?.github_url || previous.github,
        linkedin: siteInfo?.linkedin_url || previous.linkedin,
        site: siteInfo?.site_url || previous.site,
        location: siteInfo?.location || previous.location,
      }));

      toast({
        title: "PortfÃ³lio importado",
        description: `${mappedSkills.length} skills e ${mappedProjects.length} projetos entraram no currÃ­culo ${lang.toUpperCase()}.`,
      });
    } catch {
      toast({
        title: "Erro ao importar",
        description: "Confirme se vocÃª estÃ¡ logado e o servidor estÃ¡ no ar.",
        variant: "destructive",
      });
    } finally {
      setAutofilling(false);
    }
  };

  const generate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${API_URL}/api/resume/generate?_t=${Date.now()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao gerar currÃ­culo");
      const result = await response.json();
      setGeneratedHTML(result.html);
      toast({ title: "VersÃ£o ATS gerada", description: "Texto puro, sem colunas, pronta para sistemas de triagem." });
    } catch {
      toast({ title: "Erro ao gerar currÃ­culo", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!generatedHTML) {
      toast({ title: "Gere a versÃ£o ATS primeiro", variant: "destructive" });
      return;
    }
    setDownloadingPdf(true);
    try {
      const { default: html2pdf } = await import("html2pdf.js");
      const container = document.createElement("div");
      container.innerHTML = generatedHTML;
      container.style.padding = "20px";

      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `curriculo-${data.name.toLowerCase().replace(/\s+/g, "-")}-${lang}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .save();

      toast({ title: "PDF baixado" });
    } catch {
      toast({ title: "Erro ao gerar PDF", variant: "destructive" });
    } finally {
      setDownloadingPdf(false);
    }
  };

  const copy = async (kind: "prompt" | "text") => {
    const value = kind === "prompt" ? audit.prompt : previewRef.current?.innerText || resumeToText(data);
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadFile = (content: string, extension: "html" | "txt" | "json") => {
    const mime =
      extension === "json" ? "application/json" : extension === "html" ? "text/html" : "text/plain";
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `curriculo-${lang}.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const statusIcon = (status: "pass" | "warn" | "fail") =>
    status === "pass" ? (
      <CheckCircle2 size={15} className="audit-icon pass" />
    ) : status === "warn" ? (
      <TriangleAlert size={15} className="audit-icon warn" />
    ) : (
      <XCircle size={15} className="audit-icon fail" />
    );

  const spotlight = data.education[0];

  return (
    <div className="admin-resume">
      <div className="admin-header admin-header-row">
        <div>
          <h1>CurrÃ­culo</h1>
          <p className="admin-header-sub">
            O modelo que estÃ¡ no ar em{" "}
            <Link to="/curriculo" target="_blank" className="admin-inline-link">
              /curriculo <ExternalLink size={12} />
            </Link>
            . Edite, analise e exporte.
          </p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={autofill} disabled={autofilling}>
            {autofilling ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Importar do portfÃ³lio
          </button>
          <button type="button" className="admin-btn" onClick={save} disabled={updateSite.isPending}>
            {updateSite.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Salvar
          </button>
        </div>
      </div>

      <section className="resume-model-card">
        <div className="resume-model-main">
          <span className="resume-model-label">Modelo atual</span>
          <h2>{data.name}</h2>
          <p>{data.title}</p>
          <div className="resume-model-facts">
            <span>
              <GraduationCap size={14} /> {spotlight ? `${spotlight.degree} Â· ${spotlight.institution}` : "Sem formaÃ§Ã£o"}
            </span>
            <span>
              <FileText size={14} /> {data.experiences.length} experiÃªncias Â· {data.projects.length} projetos
            </span>
            <span>
              <Sparkles size={14} /> {data.skills.length} competÃªncias
            </span>
          </div>
          {data.updatedAt && (
            <span className="resume-model-updated">
              Ãšltima atualizaÃ§Ã£o: {new Date(data.updatedAt).toLocaleString("pt-BR")}
            </span>
          )}
        </div>
        <div className="resume-model-score">
          <Gauge size={16} />
          <strong>{audit.score}</strong>
          <span>{audit.grade}</span>
        </div>
      </section>

      <div className="resume-toolbar">
        <div className="resume-lang-switch" role="group" aria-label="Idioma do currÃ­culo">
          <button type="button" className={lang === "pt" ? "active" : ""} onClick={() => setLang("pt")}>
            PortuguÃªs
          </button>
          <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            English
          </button>
        </div>
        <div className="admin-tabs" role="tablist" aria-label="SeÃ§Ãµes do currÃ­culo">
          <button type="button" role="tab" aria-selected={tab === "conteudo"} className={tab === "conteudo" ? "active" : ""} onClick={() => setTab("conteudo")}>
            <FileText size={14} /> ConteÃºdo
          </button>
          <button type="button" role="tab" aria-selected={tab === "analise"} className={tab === "analise" ? "active" : ""} onClick={() => setTab("analise")}>
            <BrainCircuit size={14} /> AnÃ¡lise & IA
            <span className={`audit-pill ${audit.score >= 75 ? "ok" : "warn"}`}>{audit.score}</span>
          </button>
          <button type="button" role="tab" aria-selected={tab === "exportar"} className={tab === "exportar" ? "active" : ""} onClick={() => setTab("exportar")}>
            <Download size={14} /> Exportar
          </button>
        </div>
      </div>

      {tab === "conteudo" && (
        <div className="resume-layout">
          <div className="resume-form-column">
            <section className="admin-card">
              <h3 className="admin-card-title">Identidade</h3>
              <div className="admin-form-grid">
                <Field label="Nome" value={data.name} onChange={(value) => update("name", value)} placeholder="Pedro Sakamoto" />
                <Field label="Cargo" value={data.title} onChange={(value) => update("title", value)} placeholder="Desenvolvedor Back-end" />
                <Field label="Cargo alvo" value={data.targetRole || ""} onChange={(value) => update("targetRole", value)} placeholder="EstÃ¡gio em Engenharia de Software" hint="Aparece no topo e guia a anÃ¡lise ATS." full />
                <Field label="E-mail" value={data.email} onChange={(value) => update("email", value)} placeholder="voce@email.com" />
                <Field label="Telefone" value={data.phone} onChange={(value) => update("phone", value)} placeholder="(16) 99999-9999" />
                <Field label="LocalizaÃ§Ã£o" value={data.location} onChange={(value) => update("location", value)} placeholder="RibeirÃ£o Preto, SP â€” remoto" />
                <Field label="LinkedIn" value={data.linkedin} onChange={(value) => update("linkedin", value)} placeholder="https://linkedin.com/in/..." />
                <Field label="GitHub" value={data.github} onChange={(value) => update("github", value)} placeholder="https://github.com/..." />
                <Field label="Site" value={data.site || ""} onChange={(value) => update("site", value)} placeholder="https://..." />
                <Field
                  label="Resumo profissional"
                  value={data.summary}
                  onChange={(value) => update("summary", value)}
                  placeholder="Quem vocÃª Ã©, o que constrÃ³i e um resultado concreto."
                  textarea
                  rows={5}
                  full
                  hint={`${data.summary.length} caracteres Â· ideal entre 240 e 700`}
                />
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-card-head">
                <h3 className="admin-card-title">ExperiÃªncia</h3>
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => addToArray("experiences", emptyExperience)}>
                  <Plus size={13} /> Adicionar
                </button>
              </div>
              {data.experiences.length === 0 && <p className="resume-empty-text">Nenhuma experiÃªncia. Adicione projetos, freelance ou estÃ¡gio.</p>}
              {data.experiences.map((experience, index) => (
                <ItemCard key={index} index={index} title={experience.company || "ExperiÃªncia"} onRemove={() => removeFromArray("experiences", index)}>
                  <div className="admin-form-grid">
                    <Field label="Cargo" value={experience.role} onChange={(value) => updateArrayItem("experiences", index, "role", value)} placeholder="Desenvolvedor Back-end" />
                    <Field label="Empresa / contexto" value={experience.company} onChange={(value) => updateArrayItem("experiences", index, "company", value)} placeholder="Freelance" />
                    <Field label="InÃ­cio" value={experience.startDate} onChange={(value) => updateArrayItem("experiences", index, "startDate", value)} placeholder="2025" />
                    <Field label="Fim" value={experience.endDate} onChange={(value) => updateArrayItem("experiences", index, "endDate", value)} placeholder="Atual" />
                    <Field label="Local" value={experience.location} onChange={(value) => updateArrayItem("experiences", index, "location", value)} placeholder="Remoto" full />
                    <Field
                      label="Bullets (uma linha cada)"
                      value={experience.description}
                      onChange={(value) => updateArrayItem("experiences", index, "description", value)}
                      placeholder="ConstruÃ­ uma API com 63 testes automatizados"
                      textarea
                      rows={4}
                      full
                      hint="Verbo + tecnologia + resultado com nÃºmero."
                    />
                  </div>
                </ItemCard>
              ))}
            </section>

            <section className="admin-card">
              <div className="admin-card-head">
                <h3 className="admin-card-title">FormaÃ§Ã£o</h3>
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => addToArray("education", emptyEducation)}>
                  <Plus size={13} /> Adicionar
                </button>
              </div>
              {data.education.length === 0 && <p className="resume-empty-text">Nenhuma formaÃ§Ã£o cadastrada.</p>}
              {data.education.map((education, index) => (
                <ItemCard key={index} index={index} title={education.institution || "FormaÃ§Ã£o"} onRemove={() => removeFromArray("education", index)}>
                  <div className="admin-form-grid">
                    <Field label="Curso" value={education.degree} onChange={(value) => updateArrayItem("education", index, "degree", value)} placeholder="Engenharia da ComputaÃ§Ã£o" />
                    <Field label="InstituiÃ§Ã£o" value={education.institution} onChange={(value) => updateArrayItem("education", index, "institution", value)} placeholder="Unaerp" />
                    <Field label="InÃ­cio" value={education.startDate} onChange={(value) => updateArrayItem("education", index, "startDate", value)} placeholder="2025" />
                    <Field label="Fim" value={education.endDate} onChange={(value) => updateArrayItem("education", index, "endDate", value)} placeholder="Cursando" />
                    <Field label="DescriÃ§Ã£o" value={education.description} onChange={(value) => updateArrayItem("education", index, "description", value)} placeholder="ÃŠnfases relevantes" full />
                  </div>
                </ItemCard>
              ))}
            </section>

            <section className="admin-card">
              <div className="admin-card-head">
                <h3 className="admin-card-title">CompetÃªncias</h3>
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => addToArray("skills", emptySkill)}>
                  <Plus size={13} /> Adicionar
                </button>
              </div>
              <div className="admin-skills-list">
                {data.skills.map((skill, index) => (
                  <div key={index} className="admin-skill-row">
                    <input
                      value={skill.name}
                      onChange={(event) => updateArrayItem("skills", index, "name", event.target.value)}
                      placeholder="Node.js"
                      className="resume-skill-input"
                    />
                    <select
                      value={skill.category}
                      onChange={(event) => updateArrayItem("skills", index, "category", event.target.value)}
                      className="resume-skill-select"
                    >
                      {skillCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="admin-btn-icon danger" onClick={() => removeFromArray("skills", index)} aria-label="Remover skill">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-card-head">
                <h3 className="admin-card-title">Projetos em destaque</h3>
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => addToArray("projects", emptyProject)}>
                  <Plus size={13} /> Adicionar
                </button>
              </div>
              {data.projects.map((project, index) => (
                <ItemCard key={index} index={index} title={project.name || "Projeto"} onRemove={() => removeFromArray("projects", index)}>
                  <div className="admin-form-grid">
                    <Field label="Nome" value={project.name} onChange={(value) => updateArrayItem("projects", index, "name", value)} placeholder="Kamikaze Bot" />
                    <Field label="Tecnologias" value={project.tech} onChange={(value) => updateArrayItem("projects", index, "tech", value)} placeholder="TypeScript, Node.js" />
                    <Field label="DescriÃ§Ã£o" value={project.description} onChange={(value) => updateArrayItem("projects", index, "description", value)} placeholder="O que resolve e qual resultado entregou" full />
                    <Field label="Link" value={project.link} onChange={(value) => updateArrayItem("projects", index, "link", value)} placeholder="https://..." full />
                  </div>
                </ItemCard>
              ))}
            </section>

            <div className="resume-two-col">
              <section className="admin-card">
                <div className="admin-card-head">
                  <h3 className="admin-card-title">Idiomas</h3>
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => addToArray("languages", emptyLanguage)}>
                    <Plus size={13} />
                  </button>
                </div>
                {data.languages.map((language, index) => (
                  <div key={index} className="admin-skill-row">
                    <input
                      value={language.name}
                      onChange={(event) => updateArrayItem("languages", index, "name", event.target.value)}
                      placeholder="InglÃªs"
                      className="resume-skill-input"
                    />
                    <select
                      value={language.level}
                      onChange={(event) => updateArrayItem("languages", index, "level", event.target.value)}
                      className="resume-skill-select"
                    >
                      {languageLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="admin-btn-icon danger" onClick={() => removeFromArray("languages", index)} aria-label="Remover idioma">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </section>

              <section className="admin-card">
                <div className="admin-card-head">
                  <h3 className="admin-card-title">CertificaÃ§Ãµes</h3>
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => addToArray("certifications", emptyCertification)}>
                    <Plus size={13} />
                  </button>
                </div>
                {data.certifications.length === 0 && <p className="resume-empty-text">Nenhuma certificaÃ§Ã£o. Cursos contam.</p>}
                {data.certifications.map((certification, index) => (
                  <div key={index} className="resume-item-card compact">
                    <div className="admin-form-grid">
                      <Field label="Nome" value={certification.name} onChange={(value) => updateArrayItem("certifications", index, "name", value)} placeholder="Curso de Go" />
                      <Field label="Emissor" value={certification.issuer} onChange={(value) => updateArrayItem("certifications", index, "issuer", value)} placeholder="Alura" />
                      <Field label="Data" value={certification.date} onChange={(value) => updateArrayItem("certifications", index, "date", value)} placeholder="2026" full />
                    </div>
                    <button type="button" className="admin-btn-icon danger resume-cert-remove" onClick={() => removeFromArray("certifications", index)} aria-label="Remover certificaÃ§Ã£o">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </section>
            </div>

            <button type="button" className="admin-btn resume-generate-btn" onClick={save} disabled={updateSite.isPending}>
              {updateSite.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Salvar currÃ­culo pÃºblico
            </button>
          </div>

          <aside className="resume-side-column">
            <section className="admin-card resume-side-card">
              <h3 className="admin-card-title">Como o recrutador vÃª</h3>
              <div className="resume-mini-preview">
                <strong>{data.name}</strong>
                <span>{data.title}</span>
                <p>{data.summary.slice(0, 220)}{data.summary.length > 220 ? "â€¦" : ""}</p>
                <ul>
                  {data.experiences.slice(0, 2).map((experience, index) => (
                    <li key={index}>
                      <b>{experience.role}</b> Â· {experience.company}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/curriculo" target="_blank" className="admin-btn admin-btn-ghost resume-open-public">
                <ExternalLink size={14} /> Abrir pÃ¡gina pÃºblica
              </Link>
            </section>

            <section className="admin-card resume-side-card">
              <h3 className="admin-card-title">Checklist rÃ¡pido</h3>
              <ul className="resume-quick-checks">
                <li className={data.summary.length >= 180 ? "ok" : "warn"}>
                  Resumo com {data.summary.length} caracteres
                </li>
                <li className={data.education.length ? "ok" : "warn"}>
                  FormaÃ§Ã£o {spotlight ? `(${spotlight.institution})` : "faltando"}
                </li>
                <li className={data.projects.filter((project) => project.link).length >= 3 ? "ok" : "warn"}>
                  {data.projects.filter((project) => project.link).length} projetos com link
                </li>
                <li className={data.languages.length >= 2 ? "ok" : "warn"}>
                  {data.languages.length} idiomas
                </li>
              </ul>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setTab("analise")}>
                <BrainCircuit size={14} /> Ver anÃ¡lise completa
              </button>
            </section>
          </aside>
        </div>
      )}

      {tab === "analise" && (
        <div className="resume-analysis">
          <section className="resume-score-card">
            <div className={`resume-score-ring ${audit.score >= 75 ? "ok" : audit.score >= 55 ? "warn" : "fail"}`}>
              <strong>{audit.score}</strong>
              <span>/100</span>
            </div>
            <div>
              <h2>{audit.grade}</h2>
              <p>
                {audit.stats.quantifiedBullets} de {audit.stats.bullets} bullets tÃªm nÃºmero Â·{" "}
                {audit.stats.skills} skills Â· {audit.stats.projects} projetos Â· {audit.stats.words} palavras.
              </p>
              <p className="resume-score-note">
                A nota Ã© calculada no navegador com regras de ATS: contato, resumo, formaÃ§Ã£o, bullets com
                resultado, verbos de aÃ§Ã£o, palavras-chave e links.
              </p>
            </div>
          </section>

          <div className="resume-analysis-grid">
            <section className="admin-card">
              <h3 className="admin-card-title">DiagnÃ³stico</h3>
              <ul className="audit-checks">
                {audit.checks.map((check) => (
                  <li key={check.id} className={`audit-row ${check.status}`}>
                    {statusIcon(check.status)}
                    <div>
                      <strong>{check.label}</strong>
                      <p>{check.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="admin-card">
              <h3 className="admin-card-title">O que fazer agora</h3>
              {audit.suggestions.length === 0 ? (
                <p className="resume-empty-text">Nada crÃ­tico. Ajuste o texto para a vaga antes de enviar.</p>
              ) : (
                <ol className="audit-suggestions">
                  {audit.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ol>
              )}
              <div className="audit-prompt-box">
                <p>
                  Quer uma reescrita com IA? Copie o prompt pronto â€” ele jÃ¡ leva seu currÃ­culo em JSON e as
                  regras para nÃ£o inventar nada.
                </p>
                <div className="audit-prompt-actions">
                  <button type="button" className="admin-btn" onClick={() => copy("prompt")}>
                    {copied === "prompt" ? <CheckCircle2 size={14} /> : <ClipboardCopy size={14} />}
                    {copied === "prompt" ? "Copiado" : "Copiar prompt para IA"}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() => downloadFile(buildResumePrompt(data), "json")}
                  >
                    <Download size={14} /> Baixar .json
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {tab === "exportar" && (
        <div className="resume-export">
          <section className="admin-card">
            <h3 className="admin-card-title">VersÃ£o ATS (texto puro)</h3>
            <p className="admin-field-hint">
              Sem colunas, sem Ã­cones, sem grÃ¡fico. Ã‰ essa versÃ£o que passa em triagem automÃ¡tica e vira PDF.
            </p>
            <div className="resume-export-actions">
              <button type="button" className="admin-btn" onClick={generate} disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                Gerar versÃ£o ATS
              </button>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={downloadPDF} disabled={downloadingPdf || !generatedHTML}>
                {downloadingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                Baixar PDF
              </button>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => copy("text")}>
                {copied === "text" ? <CheckCircle2 size={16} /> : <ClipboardCopy size={16} />}
                {copied === "text" ? "Copiado" : "Copiar texto"}
              </button>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => downloadFile(generatedHTML || resumeToText(data), generatedHTML ? "html" : "txt")} disabled={!generatedHTML && !data.summary}>
                <Download size={16} /> {generatedHTML ? "HTML" : "Texto"}
              </button>
            </div>

            {!generatedHTML && !loading && (
              <div className="resume-empty-state">
                <FileText size={36} className="resume-empty-icon" />
                <p>Clique em â€œGerar versÃ£o ATSâ€ para visualizar o texto que vai para o PDF.</p>
              </div>
            )}
            {loading && (
              <div className="resume-loading">
                <Loader2 size={20} className="animate-spin" /> Gerandoâ€¦
              </div>
            )}
            {generatedHTML && !loading && (
              <div className="resume-preview-frame" ref={previewRef}>
                <iframe srcDoc={generatedHTML} title="PrÃ©via do currÃ­culo" />
              </div>
            )}
          </section>

          <section className="admin-card">
            <h3 className="admin-card-title">PDFs publicados</h3>
            <p className="admin-field-hint">
              Os arquivos abaixo sÃ£o o que o site entrega direto no botÃ£o de download. Substitua pelo PDF
              gerado acima quando atualizar o currÃ­culo.
            </p>
            <div className="resume-file-list">
              <a href="/curriculo/curriculo-pedro-sakamoto.pdf" target="_blank" rel="noreferrer">
                <FileText size={16} /> curriculo-pedro-sakamoto.pdf <ExternalLink size={13} />
              </a>
              <a href="/curriculo/resume-pedro-sakamoto-en.pdf" target="_blank" rel="noreferrer">
                <FileText size={16} /> resume-pedro-sakamoto-en.pdf <ExternalLink size={13} />
              </a>
            </div>
            <div className="resume-export-actions">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => downloadFile(JSON.stringify(docs, null, 2), "json")}>
                <Download size={16} /> Exportar JSON (PT + EN)
              </button>
            </div>
          </section>
        </div>
      )}

      {isLoading && (
        <div className="admin-loading">
          <Loader2 className="animate-spin" /> Carregando modeloâ€¦
        </div>
      )}
    </div>
  );
};

export default AdminResume;
