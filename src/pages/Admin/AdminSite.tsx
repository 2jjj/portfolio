import { useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminSite, useUpdateSite } from "@/hooks/use-admin-api";
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
  const { data, isLoading } = useAdminSite();
  const updateMutation = useUpdateSite();

  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: { hero_description: "", stats_years: "3", stats_projects: "5", stats_dedication: "100", hero_phrases: "" },
  });

  useEffect(() => {
    if (data) {
      const phrases = Array.isArray(data.hero_phrases) ? data.hero_phrases : [];
      form.reset({
        hero_description: data.hero_description || "",
        stats_years: String(data.stats_years || "3"),
        stats_projects: String(data.stats_projects || "5"),
        stats_dedication: String(data.stats_dedication || "100"),
        hero_phrases: phrases.join("\n"),
      });
    }
  }, [data, form]);

  const handleSubmit = async (formData: SiteFormData) => {
    updateMutation.mutate({
      hero_description: formData.hero_description,
      stats_years: formData.stats_years,
      stats_projects: formData.stats_projects,
      stats_dedication: formData.stats_dedication,
      hero_phrases: formData.hero_phrases.split("\n").filter(Boolean),
    });
  };

  if (isLoading) {
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
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default AdminSite;
