import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Github } from "lucide-react";
import { api } from "@/lib/admin-api";
import GitHubImportModal from "@/components/GitHubImportModal";

const categories = [
  "Back-End",
  "Front-End",
  "Full Stack",
  "DevOps",
  "Mobile",
  "Outro",
];

interface ProjectForm {
  title: string;
  description: string;
  category: string;
  tags: string;
  image: string;
  github: string;
  live: string;
  featured: boolean;
}

const AdminProjectForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id && id !== "novo");
  const navigate = useNavigate();

  const [form, setForm] = useState<ProjectForm>({
    title: "",
    description: "",
    category: "Back-End",
    tags: "",
    image: "",
    github: "",
    live: "",
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      api.projects.get(Number(id)).then((p) => {
        setForm({
          title: p.title,
          description: p.description,
          category: p.category,
          tags: (p.tags || []).join(", "),
          image: p.image || "",
          github: p.github || "",
          live: p.live || "",
          featured: Boolean(p.featured),
        });
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Titulo e obrigatorio");

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        image: form.image.trim(),
        github: form.github.trim(),
        live: form.live.trim(),
        featured: form.featured ? 1 : 0,
      };

      if (isEditing && id) {
        await api.projects.update(Number(id), payload);
      } else {
        await api.projects.create(payload);
      }
      navigate("/admin/projetos");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao salvar projeto");
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleGitHubImport = (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    image: string;
    github: string;
    live: string;
  }) => {
    setForm({
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags.join(", "),
      image: data.image,
      github: data.github,
      live: data.live,
      featured: false,
    });
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <div className="admin-header">
        <button onClick={() => navigate("/admin/projetos")} className="admin-btn admin-btn-ghost">
          <ArrowLeft size={16} />
          Voltar
        </button>
        <h1>{isEditing ? "Editar Projeto" : "Novo Projeto"}</h1>
        {!isEditing && (
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            onClick={() => setGithubModalOpen(true)}
          >
            <Github size={16} />
            Importar do GitHub
          </button>
        )}
      </div>

      <GitHubImportModal
        open={githubModalOpen}
        onClose={() => setGithubModalOpen(false)}
        onImport={handleGitHubImport}
      />

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Titulo *</label>
            <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Nome do projeto" required />
          </div>

          <div className="admin-field">
            <label>Categoria</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="admin-field admin-field-full">
            <label>Descricao</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Descricao do projeto..."
              rows={4}
            />
          </div>

          <div className="admin-field admin-field-full">
            <label>Tags (separadas por virgula)</label>
            <input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="React, Node.js, TypeScript" />
          </div>

          <div className="admin-field">
            <label>Imagem (URL)</label>
            <input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." />
          </div>

          <div className="admin-field">
            <label>GitHub (URL)</label>
            <input value={form.github} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/..." />
          </div>

          <div className="admin-field">
            <label>Link Live (URL)</label>
            <input value={form.live} onChange={(e) => update("live", e.target.value)} placeholder="https://..." />
          </div>

          <div className="admin-field">
            <label className="admin-checkbox">
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
              Projeto em destaque
            </label>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {isEditing ? "Salvar Alteracoes" : "Criar Projeto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectForm;
