import { useState, useRef } from "react";
import {
  FileText,
  Download,
  Loader2,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";

interface Experience {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  name: string;
  category: string;
}

interface Project {
  name: string;
  description: string;
  tech: string;
  link: string;
}

interface Language {
  name: string;
  level: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
}

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
const emptySkill = (): Skill => ({ name: "", category: "Front-End" });
const emptyProject = (): Project => ({
  name: "",
  description: "",
  tech: "",
  link: "",
});
const emptyLanguage = (): Language => ({
  name: "",
  level: "Intermediario",
});
const emptyCertification = (): Certification => ({
  name: "",
  issuer: "",
  date: "",
});

const skillCategories = [
  "Front-End",
  "Back-End",
  "Banco de Dados",
  "DevOps",
  "Mobile",
  "Ferramentas",
  "Outro",
];
const languageLevels = ["Basico", "Intermediario", "Avancado", "Fluente", "Nativo"];

const API_URL = import.meta.env.VITE_API_URL || "";

const AdminResume = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [autofilling, setAutofilling] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ResumeData>({
    name: "Pedro Sakamoto",
    title: "Full Stack Developer",
    email: "pedrosakamoto27@gmail.com",
    phone: "",
    location: "Riberao Preto, SP",
    linkedin: "linkedin.com/in/pedro-sakamoto-3b94091a1",
    github: "github.com/2jjj",
    summary: "",
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    languages: [{ name: "Portugues", level: "Nativo" }],
    certifications: [],
  });

  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const addToArray = <T,>(key: keyof ResumeData, empty: () => T) => {
    setData((prev) => ({
      ...prev,
      [key]: [...(prev[key] as unknown[]), empty()],
    }));
  };

  const removeFromArray = (key: keyof ResumeData, index: number) => {
    setData((prev) => ({
      ...prev,
      [key]: (prev[key] as unknown[]).filter((_: unknown, i: number) => i !== index),
    }));
  };

  const updateArrayItem = (
    key: keyof ResumeData,
    index: number,
    field: string,
    value: string
  ) => {
    setData((prev) => {
      const arr = [...(prev[key] as Record<string, string>[])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });
  };

  const autofill = async () => {
    setAutofilling(true);
    try {
      const token = localStorage.getItem("admin_token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const [skillsRes, projectsRes, siteRes] = await Promise.all([
        fetch(`${API_URL}/api/skills?_t=${Date.now()}`, { headers }).then((r) =>
          r.json()
        ),
        fetch(`${API_URL}/api/projects?_t=${Date.now()}`, { headers }).then((r) =>
          r.json()
        ),
        fetch(`${API_URL}/api/site?_t=${Date.now()}`, { headers }).then((r) =>
          r.json()
        ),
      ]);

      const mappedSkills: Skill[] = (skillsRes || []).map(
        (s: { title: string; category: string }) => ({
          name: s.title || "",
          category: s.category || "Outro",
        })
      );

      const mappedProjects: Project[] = (projectsRes || []).map(
        (p: {
          title: string;
          description: string;
          tags: string | string[];
          github: string;
          live: string;
        }) => ({
          name: p.title || "",
          description: p.description || "",
          tech: Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "",
          link: p.live || p.github || "",
        })
      );

      setData((prev) => ({
        ...prev,
        skills: mappedSkills.length > 0 ? mappedSkills : prev.skills,
        projects: mappedProjects.length > 0 ? mappedProjects : prev.projects,
        summary:
          siteRes?.hero_description && !prev.summary
            ? siteRes.hero_description
            : prev.summary,
      }));

      toast({
        title: "Dados preenchidos!",
        description: `${mappedSkills.length} skills e ${mappedProjects.length} projetos importados.`,
      });
    } catch {
      toast({
        title: "Erro ao auto-preencher",
        description: "Verifique o login e tente novamente.",
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
      const res = await fetch(
        `${API_URL}/api/resume/generate?_t=${Date.now()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Erro ao gerar curriculo");

      const result = await res.json();
      setGeneratedHTML(result.html);
      toast({ title: "Curriculo gerado com sucesso!" });
    } catch {
      toast({ title: "Erro ao gerar curriculo", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!generatedHTML) return;
    setDownloadingPdf(true);
    try {
      const container = document.createElement("div");
      container.innerHTML = generatedHTML;
      container.style.padding = "20px";

      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `curriculo-${data.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .save();

      toast({ title: "PDF baixado com sucesso!" });
    } catch {
      toast({ title: "Erro ao gerar PDF", variant: "destructive" });
    } finally {
      setDownloadingPdf(false);
    }
  };

  const copyText = () => {
    const el = previewRef.current;
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadHTML = () => {
    const blob = new Blob([generatedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `curriculo-${data.name.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Curriculo</h1>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          marginTop: "-0.5rem",
        }}
      >
        <p
          style={{
            color: "var(--text2)",
            fontSize: "0.85rem",
            margin: 0,
            flex: 1,
          }}
        >
          Preencha seus dados ou importe do portfolio para gerar um PDF
          profissional.
        </p>
        <button
          className="admin-btn admin-btn-ghost"
          onClick={autofill}
          disabled={autofilling}
          style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
        >
          {autofilling ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          Auto-preencher do Portfolio
        </button>
      </div>

      <div className="resume-layout">
        {/* LEFT: Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Personal Info */}
          <div className="resume-form-card">
            <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
                color: "var(--text)",
              }}
            >
              Informacoes Pessoais
            </h3>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Nome</label>
                <input
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="admin-field">
                <label>Cargo</label>
                <input
                  value={data.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Ex: Full Stack Developer"
                />
              </div>
              <div className="admin-field">
                <label>Email</label>
                <input
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="email@email.com"
                />
              </div>
              <div className="admin-field">
                <label>Telefone</label>
                <input
                  value={data.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(XX) XXXXX-XXXX"
                />
              </div>
              <div className="admin-field">
                <label>Localizacao</label>
                <input
                  value={data.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="Cidade, Estado"
                />
              </div>
              <div className="admin-field">
                <label>LinkedIn</label>
                <input
                  value={data.linkedin}
                  onChange={(e) => update("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/..."
                />
              </div>
              <div className="admin-field admin-field-full">
                <label>GitHub</label>
                <input
                  value={data.github}
                  onChange={(e) => update("github", e.target.value)}
                  placeholder="github.com/..."
                />
              </div>
              <div className="admin-field admin-field-full">
                <label>Resumo Profissional</label>
                <textarea
                  value={data.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  placeholder="Breve descricao sobre sua experiencia..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="resume-form-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Experiencia Profissional
              </h3>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => addToArray("experiences", emptyExperience)}
                style={{ padding: "0.35rem 0.65rem", fontSize: "0.7rem" }}
              >
                <Plus size={13} /> Adicionar
              </button>
            </div>
            {data.experiences.length === 0 && (
              <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>
                Nenhuma experiencia adicionada.
              </p>
            )}
            {data.experiences.map((exp, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "0.85rem",
                  marginBottom: "0.6rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text2)",
                      fontWeight: 600,
                    }}
                  >
                    #{i + 1}
                  </span>
                  <button
                    className="admin-btn-icon danger"
                    onClick={() => removeFromArray("experiences", i)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Cargo</label>
                    <input
                      value={exp.role}
                      onChange={(e) =>
                        updateArrayItem("experiences", i, "role", e.target.value)
                      }
                      placeholder="Desenvolvedor Backend"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Empresa</label>
                    <input
                      value={exp.company}
                      onChange={(e) =>
                        updateArrayItem(
                          "experiences",
                          i,
                          "company",
                          e.target.value
                        )
                      }
                      placeholder="Empresa X"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Inicio</label>
                    <input
                      value={exp.startDate}
                      onChange={(e) =>
                        updateArrayItem(
                          "experiences",
                          i,
                          "startDate",
                          e.target.value
                        )
                      }
                      placeholder="Jan 2023"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Fim</label>
                    <input
                      value={exp.endDate}
                      onChange={(e) =>
                        updateArrayItem(
                          "experiences",
                          i,
                          "endDate",
                          e.target.value
                        )
                      }
                      placeholder="Presente"
                    />
                  </div>
                  <div className="admin-field admin-field-full">
                    <label>Descricao (uma linha por bullet)</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "experiences",
                          i,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Desenvolvimento de APIs REST&#10;Integracao com sistemas de pagamento"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="resume-form-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Formacao Academica
              </h3>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => addToArray("education", emptyEducation)}
                style={{ padding: "0.35rem 0.65rem", fontSize: "0.7rem" }}
              >
                <Plus size={13} /> Adicionar
              </button>
            </div>
            {data.education.length === 0 && (
              <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>
                Nenhuma formacao adicionada.
              </p>
            )}
            {data.education.map((edu, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "0.85rem",
                  marginBottom: "0.6rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text2)",
                      fontWeight: 600,
                    }}
                  >
                    #{i + 1}
                  </span>
                  <button
                    className="admin-btn-icon danger"
                    onClick={() => removeFromArray("education", i)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Curso</label>
                    <input
                      value={edu.degree}
                      onChange={(e) =>
                        updateArrayItem("education", i, "degree", e.target.value)
                      }
                      placeholder="Engenharia de Software"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Instituicao</label>
                    <input
                      value={edu.institution}
                      onChange={(e) =>
                        updateArrayItem(
                          "education",
                          i,
                          "institution",
                          e.target.value
                        )
                      }
                      placeholder="Universidade X"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Inicio</label>
                    <input
                      value={edu.startDate}
                      onChange={(e) =>
                        updateArrayItem(
                          "education",
                          i,
                          "startDate",
                          e.target.value
                        )
                      }
                      placeholder="Jan 2020"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Fim</label>
                    <input
                      value={edu.endDate}
                      onChange={(e) =>
                        updateArrayItem(
                          "education",
                          i,
                          "endDate",
                          e.target.value
                        )
                      }
                      placeholder="Dez 2024"
                    />
                  </div>
                  <div className="admin-field admin-field-full">
                    <label>Descricao</label>
                    <input
                      value={edu.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "education",
                          i,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Detalhes relevantes..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="resume-form-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Habilidades
              </h3>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => addToArray("skills", emptySkill)}
                style={{ padding: "0.35rem 0.65rem", fontSize: "0.7rem" }}
              >
                <Plus size={13} /> Adicionar
              </button>
            </div>
            {data.skills.length === 0 && (
              <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>
                Nenhuma habilidade adicionada.
              </p>
            )}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
            >
              {data.skills.map((skill, i) => (
                <div key={i} className="admin-skill-row">
                  <input
                    value={skill.name}
                    onChange={(e) =>
                      updateArrayItem("skills", i, "name", e.target.value)
                    }
                    placeholder="React, Node.js..."
                    style={{
                      flex: 1,
                      padding: "0.4rem 0.6rem",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--bg2)",
                      color: "var(--text)",
                      fontSize: "0.8rem",
                      fontFamily: "inherit",
                    }}
                  />
                  <select
                    value={skill.category}
                    onChange={(e) =>
                      updateArrayItem("skills", i, "category", e.target.value)
                    }
                    style={{
                      width: "120px",
                      padding: "0.4rem 0.6rem",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--bg2)",
                      color: "var(--text)",
                      fontSize: "0.8rem",
                      fontFamily: "inherit",
                    }}
                  >
                    {skillCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    className="admin-btn-icon danger"
                    onClick={() => removeFromArray("skills", i)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="resume-form-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Projetos em Destaque
              </h3>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => addToArray("projects", emptyProject)}
                style={{ padding: "0.35rem 0.65rem", fontSize: "0.7rem" }}
              >
                <Plus size={13} /> Adicionar
              </button>
            </div>
            {data.projects.length === 0 && (
              <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>
                Nenhum projeto adicionado.
              </p>
            )}
            {data.projects.map((proj, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "0.85rem",
                  marginBottom: "0.6rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text2)",
                      fontWeight: 600,
                    }}
                  >
                    #{i + 1}
                  </span>
                  <button
                    className="admin-btn-icon danger"
                    onClick={() => removeFromArray("projects", i)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Nome</label>
                    <input
                      value={proj.name}
                      onChange={(e) =>
                        updateArrayItem("projects", i, "name", e.target.value)
                      }
                      placeholder="Nome do projeto"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Tecnologias</label>
                    <input
                      value={proj.tech}
                      onChange={(e) =>
                        updateArrayItem("projects", i, "tech", e.target.value)
                      }
                      placeholder="React, Node.js"
                    />
                  </div>
                  <div className="admin-field admin-field-full">
                    <label>Descricao</label>
                    <input
                      value={proj.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "projects",
                          i,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Breve descricao"
                    />
                  </div>
                  <div className="admin-field admin-field-full">
                    <label>Link</label>
                    <input
                      value={proj.link}
                      onChange={(e) =>
                        updateArrayItem("projects", i, "link", e.target.value)
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Languages */}
          <div className="resume-form-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Idiomas
              </h3>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => addToArray("languages", emptyLanguage)}
                style={{ padding: "0.35rem 0.65rem", fontSize: "0.7rem" }}
              >
                <Plus size={13} /> Adicionar
              </button>
            </div>
            {data.languages.map((lang, i) => (
              <div key={i} className="admin-skill-row">
                <input
                  value={lang.name}
                  onChange={(e) =>
                    updateArrayItem("languages", i, "name", e.target.value)
                  }
                  placeholder="Ingles"
                  style={{
                    flex: 1,
                    padding: "0.4rem 0.6rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "var(--bg2)",
                    color: "var(--text)",
                    fontSize: "0.8rem",
                    fontFamily: "inherit",
                  }}
                />
                <select
                  value={lang.level}
                  onChange={(e) =>
                    updateArrayItem("languages", i, "level", e.target.value)
                  }
                  style={{
                    width: "120px",
                    padding: "0.4rem 0.6rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "var(--bg2)",
                    color: "var(--text)",
                    fontSize: "0.8rem",
                    fontFamily: "inherit",
                  }}
                >
                  {languageLevels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <button
                  className="admin-btn-icon danger"
                  onClick={() => removeFromArray("languages", i)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="resume-form-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Certificacoes
              </h3>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => addToArray("certifications", emptyCertification)}
                style={{ padding: "0.35rem 0.65rem", fontSize: "0.7rem" }}
              >
                <Plus size={13} /> Adicionar
              </button>
            </div>
            {data.certifications.length === 0 && (
              <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>
                Nenhuma certificacao adicionada.
              </p>
            )}
            {data.certifications.map((cert, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "0.85rem",
                  marginBottom: "0.6rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text2)",
                      fontWeight: 600,
                    }}
                  >
                    #{i + 1}
                  </span>
                  <button
                    className="admin-btn-icon danger"
                    onClick={() => removeFromArray("certifications", i)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Nome</label>
                    <input
                      value={cert.name}
                      onChange={(e) =>
                        updateArrayItem(
                          "certifications",
                          i,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="AWS Solutions Architect"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Emissor</label>
                    <input
                      value={cert.issuer}
                      onChange={(e) =>
                        updateArrayItem(
                          "certifications",
                          i,
                          "issuer",
                          e.target.value
                        )
                      }
                      placeholder="Amazon"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Data</label>
                    <input
                      value={cert.date}
                      onChange={(e) =>
                        updateArrayItem(
                          "certifications",
                          i,
                          "date",
                          e.target.value
                        )
                      }
                      placeholder="Mar 2024"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <button
            className="admin-btn"
            onClick={generate}
            disabled={loading}
            style={{ padding: "0.8rem 2rem", fontSize: "0.9rem" }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Gerando...
              </>
            ) : (
              <>
                <FileText size={18} /> Gerar Curriculo
              </>
            )}
          </button>
        </div>

        {/* RIGHT: Preview */}
        <div className="resume-preview-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "var(--text)",
                margin: 0,
              }}
            >
              Preview
            </h3>
          </div>

          {!generatedHTML && !loading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4rem 2rem",
                textAlign: "center",
                color: "var(--text2)",
                border: "1px dashed var(--border)",
                borderRadius: "8px",
              }}
            >
              <FileText
                size={36}
                style={{ marginBottom: "1rem", opacity: 0.3 }}
              />
              <p style={{ fontSize: "0.85rem" }}>
                Clique em "Gerar Curriculo" para visualizar e baixar em PDF.
              </p>
            </div>
          )}

          {loading && (
            <div className="resume-loading">
              <Loader2 size={20} className="animate-spin" />
              Gerando curriculo...
            </div>
          )}

          {generatedHTML && !loading && (
            <>
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "0.75rem",
                }}
              >
                <iframe
                  ref={previewRef as React.RefObject<HTMLIFrameElement>}
                  srcDoc={generatedHTML}
                  style={{
                    width: "100%",
                    height: "500px",
                    border: "none",
                    background: "#fff",
                  }}
                  title="Preview Curriculo"
                />
              </div>

              <div className="resume-actions">
                <button
                  className="admin-btn"
                  onClick={downloadPDF}
                  disabled={downloadingPdf}
                  style={{ flex: 1 }}
                >
                  {downloadingPdf ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}{" "}
                  Baixar PDF
                </button>
                <button
                  className="admin-btn admin-btn-ghost"
                  onClick={copyText}
                  style={{ flex: 1 }}
                >
                  {copied ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}{" "}
                  Copiar
                </button>
                <button
                  className="admin-btn admin-btn-ghost"
                  onClick={downloadHTML}
                  style={{ flex: 1 }}
                >
                  <Download size={16} /> .HTML
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminResume;
