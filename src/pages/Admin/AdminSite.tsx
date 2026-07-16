import { useEffect, useState, type FormEvent } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "@/lib/admin-api";

interface SiteForm {
  hero_description: string;
  stats_years: string;
  stats_projects: string;
  stats_dedication: string;
}

const AdminSite = () => {
  const [form, setForm] = useState<SiteForm>({
    hero_description: "",
    stats_years: "3",
    stats_projects: "5",
    stats_dedication: "100",
  });
  const [phrases, setPhrases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.site.get()
      .then((data) => {
        setForm({
          hero_description: data.hero_description || "",
          stats_years: String(data.stats_years || "3"),
          stats_projects: String(data.stats_projects || "5"),
          stats_dedication: String(data.stats_dedication || "100"),
        });
        setPhrases(Array.isArray(data.hero_phrases) ? data.hero_phrases : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.site.update({ ...form, hero_phrases: phrases.filter(Boolean) });
      alert("Informacoes salvas!");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <div className="admin-header">
        <h1>Hero / Site</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-field">
          <label>Descricao do Hero</label>
          <textarea
            value={form.hero_description}
            onChange={(e) => setForm((prev) => ({ ...prev, hero_description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="admin-field">
          <label>Frases do efeito typing (uma por linha)</label>
          <textarea
            value={phrases.join("\n")}
            onChange={(e) => setPhrases(e.target.value.split("\n"))}
            rows={5}
          />
        </div>

        <div className="admin-field">
          <label>Anos de Experiencia</label>
          <input
            type="number"
            min={0}
            value={form.stats_years}
            onChange={(e) => setForm((prev) => ({ ...prev, stats_years: e.target.value }))}
          />
        </div>

        <div className="admin-field">
          <label>Projetos Completos</label>
          <input
            type="number"
            min={0}
            value={form.stats_projects}
            onChange={(e) => setForm((prev) => ({ ...prev, stats_projects: e.target.value }))}
          />
        </div>

        <div className="admin-field">
          <label>Dedicacao (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.stats_dedication}
            onChange={(e) => setForm((prev) => ({ ...prev, stats_dedication: e.target.value }))}
          />
        </div>

        <button type="submit" className="admin-btn" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Salvar
        </button>
      </form>
    </div>
  );
};

export default AdminSite;
