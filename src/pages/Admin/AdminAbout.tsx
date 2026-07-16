import { useEffect, useState, type FormEvent } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "@/lib/admin-api";

interface AboutForm {
  about_text: string;
  about_secondary: string;
}

const AdminAbout = () => {
  const [form, setForm] = useState<AboutForm>({ about_text: "", about_secondary: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.about.get().then((data) => {
      setForm({ about_text: data.about_text || "", about_secondary: data.about_secondary || "" });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.about.update(form);
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
        <h1>Sobre Mim</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-field">
          <label>Texto Principal</label>
          <textarea
            value={form.about_text}
            onChange={(e) => setForm((prev) => ({ ...prev, about_text: e.target.value }))}
            rows={5}
          />
        </div>

        <div className="admin-field">
          <label>Texto Secundario</label>
          <textarea
            value={form.about_secondary}
            onChange={(e) => setForm((prev) => ({ ...prev, about_secondary: e.target.value }))}
            rows={4}
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

export default AdminAbout;
