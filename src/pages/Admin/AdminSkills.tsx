import { useEffect, useState, FormEvent } from "react";
import { Save, Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { api } from "@/lib/admin-api";

const CATEGORIES = ["Back-End", "Front-End", "DevOps", "Mobile", "Outro"];
const COLORS = ["#00D4FF", "#7B2FFF", "#FF6B35", "#1E7F3A", "#3265A8", "#DD1E1E", "#00ADD8", "#6DB33F", "#2496ED", "#A5F3FF"];

const emptySkill = () => ({ title: "", category: "Back-End", level: 50, color: "#00D4FF" });

const AdminSkills = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.skills.get().then(setSkills).catch(console.error).finally(() => setLoading(false));
  }, []);

  const add = () => setSkills((prev) => [...prev, emptySkill()]);

  const remove = (index: number) => {
    if (skills.length <= 1) return;
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const update = (index: number, key: string, value: any) => {
    setSkills((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const valid = skills.filter((s) => s.title.trim());
    if (valid.length === 0) return alert("Adicione pelo menos uma skill");

    setSaving(true);
    try {
      await api.skills.update(valid);
      alert("Skills salvas!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <div className="admin-header">
        <h1>Skills</h1>
        <button onClick={add} className="admin-btn">
          <Plus size={16} />
          Adicionar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-skills-list">
          {skills.map((skill, index) => (
            <div key={index} className="admin-skill-row">
              <div className="admin-skill-drag">
                <GripVertical size={16} />
              </div>

              <div className="admin-skill-fields">
                <input
                  type="text"
                  value={skill.title}
                  onChange={(e) => update(index, "title", e.target.value)}
                  placeholder="Nome"
                />
                <select value={skill.category} onChange={(e) => update(index, "category", e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <div className="admin-skill-level">
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={skill.level}
                    onChange={(e) => update(index, "level", Number(e.target.value))}
                  />
                  <span>{skill.level}%</span>
                </div>
                <input
                  type="color"
                  value={skill.color}
                  onChange={(e) => update(index, "color", e.target.value)}
                  className="admin-color-input"
                />
                <button type="button" onClick={() => remove(index)} className="admin-btn-icon danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="admin-btn" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Salvar Skills
        </button>
      </form>
    </div>
  );
};

export default AdminSkills;
