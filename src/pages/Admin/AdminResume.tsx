import { useState } from "react";
import { FileText, Download, Loader2, Plus, Trash2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const emptyExperience = (): Experience => ({ role: "", company: "", startDate: "", endDate: "", location: "", description: "" });
const emptyEducation = (): Education => ({ degree: "", institution: "", startDate: "", endDate: "", description: "" });
const emptySkill = (): Skill => ({ name: "", category: "Front-End" });
const emptyProject = (): Project => ({ name: "", description: "", tech: "", link: "" });
const emptyLanguage = (): Language => ({ name: "", level: "Intermediário" });
const emptyCertification = (): Certification => ({ name: "", issuer: "", date: "" });

const skillCategories = ["Front-End", "Back-End", "Banco de Dados", "DevOps", "Mobile", "Ferramentas", "Outro"];
const languageLevels = ["Básico", "Intermediário", "Avançado", "Fluente", "Nativo"];

const API_URL = import.meta.env.VITE_API_URL || "";

const AdminResume = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "html">("text");

  const [data, setData] = useState<ResumeData>({
    name: "Pedro Sakamoto",
    title: "Full Stack Developer",
    email: "pedrosakamoto27@gmail.com",
    phone: "",
    location: "Ribeirão Preto, SP",
    linkedin: "linkedin.com/in/pedro-sakamoto-3b94091a1",
    github: "github.com/2jjj",
    summary: "",
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    languages: [{ name: "Português", level: "Nativo" }],
    certifications: [],
  });

  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Generic array helpers
  const addToArray = <T,>(key: keyof ResumeData, empty: () => T) => {
    setData((prev) => ({ ...prev, [key]: [...(prev[key] as any[]), empty()] }));
  };

  const removeFromArray = (key: keyof ResumeData, index: number) => {
    setData((prev) => ({
      ...prev,
      [key]: (prev[key] as any[]).filter((_: any, i: number) => i !== index),
    }));
  };

  const updateArrayItem = (key: keyof ResumeData, index: number, field: string, value: string) => {
    setData((prev) => {
      const arr = [...(prev[key] as any[])] as any[];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });
  };

  const generate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/resume/generate?_t=${Date.now()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao gerar currículo");

      const result = await res.json();
      setGeneratedText(result.text);
      setGeneratedHTML(result.html);
      toast({ title: "Currículo gerado com sucesso!", variant: "default" });
    } catch (err) {
      toast({ title: "Erro ao gerar currículo", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const downloadText = () => {
    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `curriculo-${data.name.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Gerador de Currículo</h1>
      </div>

      <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1.5rem", marginTop: "-0.5rem" }}>
        Preencha seus dados e gere um currículo profissional formatado para LinkedIn e entrevistas.
      </p>

      <div className="resume-layout">
        {/* LEFT: Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Personal Info */}
          <div className="resume-form-card">
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text)" }}>
              Informações Pessoais
            </h3>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Nome Completo</label>
                <input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Seu nome" />
              </div>
              <div className="admin-field">
                <label>Cargo / Título</label>
                <input value={data.title} onChange={(e) => update("title", e.target.value)} placeholder="Ex: Full Stack Developer" />
              </div>
              <div className="admin-field">
                <label>Email</label>
                <input value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="email@email.com" />
              </div>
              <div className="admin-field">
                <label>Telefone</label>
                <input value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(XX) XXXXX-XXXX" />
              </div>
              <div className="admin-field">
                <label>Localização</label>
                <input value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="Cidade, Estado" />
              </div>
              <div className="admin-field">
                <label>LinkedIn</label>
                <input value={data.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="linkedin.com/in/..." />
              </div>
              <div className="admin-field admin-field-full">
                <label>GitHub</label>
                <input value={data.github} onChange={(e) => update("github", e.target.value)} placeholder="github.com/..." />
              </div>
              <div className="admin-field admin-field-full">
                <label>Resumo Profissional</label>
                <textarea
                  value={data.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  placeholder="Breve descrição sobre sua experiência e objetivos profissionais..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="resume-form-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>Experiência Profissional</h3>
              <button className="admin-btn admin-btn-ghost" onClick={() => addToArray("experiences", emptyExperience)} style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}>
                <Plus size={14} /> Adicionar
              </button>
            </div>
            {data.experiences.length === 0 && (
              <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>Nenhuma experiência adicionada.</p>
            )}
            {data.experiences.map((exp, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600 }}>#{i + 1}</span>
                  <button className="admin-btn-icon danger" onClick={() => removeFromArray("experiences", i)}><Trash2 size={14} /></button>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field"><label>Cargo</label><input value={exp.role} onChange={(e) => updateArrayItem("experiences", i, "role", e.target.value)} placeholder="Ex: Desenvolvedor Backend" /></div>
                  <div className="admin-field"><label>Empresa</label><input value={exp.company} onChange={(e) => updateArrayItem("experiences", i, "company", e.target.value)} placeholder="Ex: Empresa X" /></div>
                  <div className="admin-field"><label>Data Início</label><input value={exp.startDate} onChange={(e) => updateArrayItem("experiences", i, "startDate", e.target.value)} placeholder="Jan 2023" /></div>
                  <div className="admin-field"><label>Data Fim</label><input value={exp.endDate} onChange={(e) => updateArrayItem("experiences", i, "endDate", e.target.value)} placeholder="Presente" /></div>
                  <div className="admin-field admin-field-full"><label>Descrição (uma linha por bullet point)</label><textarea value={exp.description} onChange={(e) => updateArrayItem("experiences", i, "description", e.target.value)} placeholder="Desenvolvimento de APIs REST&#10;Integração com sistemas de pagamento&#10;Otimização de consultas SQL" rows={3} /></div>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="resume-form-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>Formação Acadêmica</h3>
              <button className="admin-btn admin-btn-ghost" onClick={() => addToArray("education", emptyEducation)} style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}>
                <Plus size={14} /> Adicionar
              </button>
            </div>
            {data.education.length === 0 && (
              <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>Nenhuma formação adicionada.</p>
            )}
            {data.education.map((edu, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600 }}>#{i + 1}</span>
                  <button className="admin-btn-icon danger" onClick={() => removeFromArray("education", i)}><Trash2 size={14} /></button>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field"><label>Grau / Curso</label><input value={edu.degree} onChange={(e) => updateArrayItem("education", i, "degree", e.target.value)} placeholder="Ex: Engenharia de Software" /></div>
                  <div className="admin-field"><label>Instituição</label><input value={edu.institution} onChange={(e) => updateArrayItem("education", i, "institution", e.target.value)} placeholder="Ex: Universidade X" /></div>
                  <div className="admin-field"><label>Data Início</label><input value={edu.startDate} onChange={(e) => updateArrayItem("education", i, "startDate", e.target.value)} placeholder="Jan 2020" /></div>
                  <div className="admin-field"><label>Data Fim</label><input value={edu.endDate} onChange={(e) => updateArrayItem("education", i, "endDate", e.target.value)} placeholder="Dez 2024" /></div>
                  <div className="admin-field admin-field-full"><label>Descrição</label><input value={edu.description} onChange={(e) => updateArrayItem("education", i, "description", e.target.value)} placeholder="Detalhes relevantes..." /></div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="resume-form-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>Habilidades</h3>
              <button className="admin-btn admin-btn-ghost" onClick={() => addToArray("skills", emptySkill)} style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}>
                <Plus size={14} /> Adicionar
              </button>
            </div>
            {data.skills.length === 0 && (
              <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>Nenhuma habilidade adicionada.</p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {data.skills.map((skill, i) => (
                <div key={i} className="admin-skill-row">
                  <input
                    value={skill.name}
                    onChange={(e) => updateArrayItem("skills", i, "name", e.target.value)}
                    placeholder="Ex: React, Node.js, PostgreSQL..."
                    style={{ flex: 1, padding: "0.45rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: "0.8rem", fontFamily: "inherit" }}
                  />
                  <select
                    value={skill.category}
                    onChange={(e) => updateArrayItem("skills", i, "category", e.target.value)}
                    style={{ width: "130px", padding: "0.45rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: "0.8rem", fontFamily: "inherit" }}
                  >
                    {skillCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button className="admin-btn-icon danger" onClick={() => removeFromArray("skills", i)}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="resume-form-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>Projetos Destacados</h3>
              <button className="admin-btn admin-btn-ghost" onClick={() => addToArray("projects", emptyProject)} style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}>
                <Plus size={14} /> Adicionar
              </button>
            </div>
            {data.projects.length === 0 && (
              <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>Nenhum projeto adicionado.</p>
            )}
            {data.projects.map((proj, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600 }}>#{i + 1}</span>
                  <button className="admin-btn-icon danger" onClick={() => removeFromArray("projects", i)}><Trash2 size={14} /></button>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field"><label>Nome</label><input value={proj.name} onChange={(e) => updateArrayItem("projects", i, "name", e.target.value)} placeholder="Nome do projeto" /></div>
                  <div className="admin-field"><label>Tecnologias</label><input value={proj.tech} onChange={(e) => updateArrayItem("projects", i, "tech", e.target.value)} placeholder="React, Node.js, PostgreSQL" /></div>
                  <div className="admin-field admin-field-full"><label>Descrição</label><input value={proj.description} onChange={(e) => updateArrayItem("projects", i, "description", e.target.value)} placeholder="Breve descrição do projeto" /></div>
                  <div className="admin-field admin-field-full"><label>Link</label><input value={proj.link} onChange={(e) => updateArrayItem("projects", i, "link", e.target.value)} placeholder="https://..." /></div>
                </div>
              </div>
            ))}
          </div>

          {/* Languages */}
          <div className="resume-form-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>Idiomas</h3>
              <button className="admin-btn admin-btn-ghost" onClick={() => addToArray("languages", emptyLanguage)} style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}>
                <Plus size={14} /> Adicionar
              </button>
            </div>
            {data.languages.map((lang, i) => (
              <div key={i} className="admin-skill-row">
                <input
                  value={lang.name}
                  onChange={(e) => updateArrayItem("languages", i, "name", e.target.value)}
                  placeholder="Ex: Inglês"
                  style={{ flex: 1, padding: "0.45rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: "0.8rem", fontFamily: "inherit" }}
                />
                <select
                  value={lang.level}
                  onChange={(e) => updateArrayItem("languages", i, "level", e.target.value)}
                  style={{ width: "130px", padding: "0.45rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: "0.8rem", fontFamily: "inherit" }}
                >
                  {languageLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                <button className="admin-btn-icon danger" onClick={() => removeFromArray("languages", i)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="resume-form-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>Certificações</h3>
              <button className="admin-btn admin-btn-ghost" onClick={() => addToArray("certifications", emptyCertification)} style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}>
                <Plus size={14} /> Adicionar
              </button>
            </div>
            {data.certifications.length === 0 && (
              <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>Nenhuma certificação adicionada.</p>
            )}
            {data.certifications.map((cert, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600 }}>#{i + 1}</span>
                  <button className="admin-btn-icon danger" onClick={() => removeFromArray("certifications", i)}><Trash2 size={14} /></button>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field"><label>Nome</label><input value={cert.name} onChange={(e) => updateArrayItem("certifications", i, "name", e.target.value)} placeholder="Ex: AWS Solutions Architect" /></div>
                  <div className="admin-field"><label>Emitter</label><input value={cert.issuer} onChange={(e) => updateArrayItem("certifications", i, "issuer", e.target.value)} placeholder="Ex: Amazon" /></div>
                  <div className="admin-field"><label>Data</label><input value={cert.date} onChange={(e) => updateArrayItem("certifications", i, "date", e.target.value)} placeholder="Mar 2024" /></div>
                </div>
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <button className="admin-btn" onClick={generate} disabled={loading} style={{ padding: "0.85rem 2rem", fontSize: "0.9rem" }}>
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Gerando...</>
            ) : (
              <><FileText size={18} /> Gerar Currículo</>
            )}
          </button>
        </div>

        {/* RIGHT: Preview */}
        <div className="resume-preview-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>Preview</h3>
            {generatedText && (
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  className={`admin-btn ${activeTab === "text" ? "" : "admin-btn-ghost"}`}
                  onClick={() => setActiveTab("text")}
                  style={{ padding: "0.35rem 0.65rem", fontSize: "0.7rem" }}
                >
                  Texto
                </button>
                <button
                  className={`admin-btn ${activeTab === "html" ? "" : "admin-btn-ghost"}`}
                  onClick={() => setActiveTab("html")}
                  style={{ padding: "0.35rem 0.65rem", fontSize: "0.7rem" }}
                >
                  HTML
                </button>
              </div>
            )}
          </div>

          {!generatedText && !loading && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem 2rem",
              textAlign: "center",
              color: "var(--text2)",
              border: "1px dashed var(--border)",
              borderRadius: "8px",
            }}>
              <FileText size={36} style={{ marginBottom: "1rem", opacity: 0.3 }} />
              <p style={{ fontSize: "0.85rem" }}>Preencha seus dados e clique em "Gerar Currículo" para ver o resultado aqui.</p>
            </div>
          )}

          {loading && (
            <div className="resume-loading">
              <Loader2 size={20} className="animate-spin" />
              Gerando currículo profissional...
            </div>
          )}

          {generatedText && !loading && (
            <>
              {activeTab === "text" ? (
                <div className="resume-preview-content">
                  {generatedText}
                </div>
              ) : (
                <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                  <iframe
                    srcDoc={generatedHTML}
                    style={{ width: "100%", height: "500px", border: "none", background: "#fff" }}
                    title="Preview HTML"
                  />
                </div>
              )}

              <div className="resume-actions">
                <button className="admin-btn" onClick={copyText} style={{ flex: 1 }}>
                  {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Texto</>}
                </button>
                <button className="admin-btn admin-btn-ghost" onClick={downloadText} style={{ flex: 1 }}>
                  <Download size={16} /> .TXT
                </button>
                <button className="admin-btn admin-btn-ghost" onClick={downloadHTML} style={{ flex: 1 }}>
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
