import { useState, type FormEvent, useCallback } from "react";
import { Save, Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { useAdminSkills, useUpdateSkills } from "@/hooks/use-admin-api";
import type { Skill } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["Back-End", "Front-End", "DevOps", "Mobile", "Outro"];
const emptySkill = (): Skill => ({ title: "", category: "Back-End", level: 50, color: "#00D4FF" });

const AdminSkills = () => {
  const { data: serverSkills, isLoading } = useAdminSkills();
  const updateMutation = useUpdateSkills();
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const currentSkills = skills ?? serverSkills ?? [];

  const add = () => setSkills((prev) => [...(prev ?? serverSkills ?? []), emptySkill()]);
  const remove = (index: number) => {
    const updated = currentSkills.filter((_, i) => i !== index);
    if (updated.length === 0) return;
    setSkills(updated);
  };
  const update = <K extends keyof Skill>(index: number, key: K, value: Skill[K]) => {
    setSkills((prev) => {
      const base = prev ?? serverSkills ?? [];
      return base.map((s, i) => (i === index ? { ...s, [key]: value } : s));
    });
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setSkills((prev) => {
      const base = prev ?? serverSkills ?? [];
      const copy = [...base];
      const item = copy[dragIndex];
      copy.splice(dragIndex, 1);
      copy.splice(index, 0, item);
      return copy;
    });
    setDragIndex(index);
  }, [dragIndex, serverSkills]);

  const handleDragEnd = () => setDragIndex(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const valid = currentSkills.filter((s) => s.title.trim());
    if (valid.length === 0) return;
    updateMutation.mutate(valid, {
      onSuccess: () => setSkills(null),
    });
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="admin-header"><h1>Skills</h1><Skeleton className="h-10 w-28" /></div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="admin-header"><h1>Skills</h1><button onClick={add} className="admin-btn"><Plus size={16} /> Adicionar</button></div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-skills-list">
          {currentSkills.map((skill, index) => (
              <div
                  key={index}
                  className="admin-skill-row"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              style={{ opacity: dragIndex === index ? 0.5 : 1 }}
            >
              <div className="admin-skill-drag" aria-label="Arrastar para reordenar"><GripVertical size={16} /></div>
              <div className="admin-skill-fields">
                <input type="text" value={skill.title} onChange={(e) => update(index, "title", e.target.value)} placeholder="Nome" aria-label="Nome da skill" />
                <select value={skill.category} onChange={(e) => update(index, "category", e.target.value)} aria-label="Categoria">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                <div className="admin-skill-level">
                  <input type="range" min={1} max={100} value={skill.level} onChange={(e) => update(index, "level", Number(e.target.value))} aria-label="Nivel de proficiencia" />
                  <span>{skill.level}%</span>
                </div>
                <div className="admin-color-wrapper">
                  <input type="color" value={skill.color} onChange={(e) => update(index, "color", e.target.value)} className="admin-color-input" aria-label="Cor da skill" />
                  <span className="admin-color-hex">{skill.color}</span>
                </div>
                <button type="button" onClick={() => remove(index)} className="admin-btn-icon danger" aria-label="Remover skill"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className="admin-btn" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Salvar Skills
        </button>
      </form>
    </div>
  );
};
export default AdminSkills;
