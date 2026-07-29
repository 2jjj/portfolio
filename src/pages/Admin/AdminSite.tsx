import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const siteSchema = z.object({
  hero_description: z.string().max(500, "Maximo 500 caracteres").optional().default(""),
  stats_years: z.string().optional().default("3"),
  stats_projects: z.string().optional().default("5"),
  stats_dedication: z.string().optional().default("100"),
  hero_phrases: z.string().optional().default(""),
});

type SiteFormData = z.infer<typeof siteSchema>;

const AdminSite = () => {
  const [loading, setLoading] = useState(true);
  const [phrasesRaw, setPhrasesRaw] = useState("");
  const { toast } = useToast();

  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: { hero_description: "", stats_years: "3", stats_projects: "5", stats_dedication: "100", hero_phrases: "" },
  });

  useEffect(() => {
    api.site.get().then((data) => {
      const phrases = Array.isArray(data.hero_phrases) ? data.hero_phrases : [];
      form.reset({ hero_description: data.hero_description || "", stats_years: String(data.stats_years || "3"), stats_projects: String(data.stats_projects || "5"), stats_dedication: String(data.stats_dedication || "100"), hero_phrases: phrases.join("\n") });
    }).catch(() => {
      toast({ title: "Erro", description: "Erro ao carregar dados", variant: "destructive" });
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (data: SiteFormData) => {
    try {
      await api.site.update({ hero_description: data.hero_description, stats_years: data.stats_years, stats_projects: data.stats_projects, stats_dedication: data.stats_dedication, hero_phrases: data.hero_phrases.split("\n").filter(Boolean) });
      toast({ title: "Salvo!", description: "Informacoes do site salvas." });
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao salvar", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="admin-header"><h1>Hero / Site</h1></div>
        <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-32 w-full" /><Skeleton className="h-12 w-full" /></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="admin-header"><h1>Hero / Site</h1></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="admin-form">
          <FormField control={form.control} name="hero_description" render={({ field }) => (
            <FormItem><FormLabel>Descricao do Hero</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="hero_phrases" render={({ field }) => (
            <FormItem><FormLabel>Frases do efeito typing (uma por linha)</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="stats_years" render={({ field }) => (
            <FormItem><FormLabel>Anos de Experiencia</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="stats_projects" render={({ field }) => (
            <FormItem><FormLabel>Projetos Completos</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="stats_dedication" render={({ field }) => (
            <FormItem><FormLabel>Dedicacao (%)</FormLabel><FormControl><Input type="number" min={0} max={100} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default AdminSite;
