import { useEffect, useState, type FormEvent } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface AboutForm { about_text: string; about_secondary: string; }

const AdminAbout = () => {
  const [form, setForm] = useState<AboutForm>({ about_text: "", about_secondary: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.about.get().then((data) => {
      setForm({ about_text: data.about_text || "", about_secondary: data.about_secondary || "" });
    }).catch(() => {
      toast({ title: "Erro", description: "Erro ao carregar dados", variant: "destructive" });
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.about.update(form);
      toast({ title: "Salvo!", description: "Informacoes salvas com sucesso." });
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao salvar", variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div>
        <div className="admin-header"><h1>Sobre Mim</h1></div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header"><h1>Sobre Mim</h1></div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-field"><label>Texto Principal</label><textarea value={form.about_text} onChange={(e) => setForm((prev) => ({ ...prev, about_text: e.target.value }))} rows={5} /></div>
        <div className="admin-field"><label>Texto Secundario</label><textarea value={form.about_secondary} onChange={(e) => setForm((prev) => ({ ...prev, about_secondary: e.target.value }))} rows={4} /></div>
        <button type="submit" className="admin-btn" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar</button>
      </form>
    </div>
  );
};
export default AdminAbout;
