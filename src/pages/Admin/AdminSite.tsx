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
  stats_years: z.string().optional().default("4"),
  stats_projects: z.string().optional().default("10"),
  hero_phrases: z.string().optional().default(""),
  github_url: z.string().max(300).optional().default(""),
  linkedin_url: z.string().max(300).optional().default(""),
  public_email: z.string().max(160).optional().default(""),
  site_url: z.string().max(300).optional().default(""),
  location: z.string().max(120).optional().default(""),
  availability: z.string().max(120).optional().default(""),
  resume_path: z.string().max(200).optional().default(""),
});

type SiteFormData = z.infer<typeof siteSchema>;

const AdminSite = () => {
  const { data, isLoading } = useAdminSite();
  const updateMutation = useUpdateSite();

  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      hero_description: "",
      stats_years: "4",
      stats_projects: "10",
      hero_phrases: "",
      github_url: "",
      linkedin_url: "",
      public_email: "",
      site_url: "",
      location: "",
      availability: "",
      resume_path: "/curriculo",
    },
  });

  useEffect(() => {
    if (data) {
      const phrases = Array.isArray(data.hero_phrases) ? data.hero_phrases : [];
      form.reset({
        hero_description: data.hero_description || "",
        stats_years: String(data.stats_years || "4"),
        stats_projects: String(data.stats_projects || "10"),
        hero_phrases: phrases.join("\n"),
        github_url: data.github_url || "",
        linkedin_url: data.linkedin_url || "",
        public_email: data.public_email || "",
        site_url: data.site_url || "",
        location: data.location || "",
        availability: data.availability || "",
        resume_path: data.resume_path || "/curriculo",
      });
    }
  }, [data, form]);

  const handleSubmit = async (formData: SiteFormData) => {
    updateMutation.mutate({
      hero_description: formData.hero_description,
      stats_years: formData.stats_years,
      stats_projects: formData.stats_projects,
      hero_phrases: formData.hero_phrases.split("\n").filter(Boolean),
      github_url: formData.github_url,
      linkedin_url: formData.linkedin_url,
      public_email: formData.public_email,
      site_url: formData.site_url,
      location: formData.location,
      availability: formData.availability,
      resume_path: formData.resume_path,
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
            <FormItem><FormLabel>Descrição do Hero</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="hero_phrases" render={({ field }) => (
            <FormItem><FormLabel>Frases do efeito typing (uma por linha)</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="stats_years" render={({ field }) => (
            <FormItem><FormLabel>Anos de experiência</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="stats_projects" render={({ field }) => (
            <FormItem><FormLabel>Projetos entregues</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <div className="admin-form-section-title">Links e presenca</div>
          <p className="admin-form-hint">
            Esses links alimentam o Hero, Contato, Curriculo, Footer e o Application Kit do Career HQ.
          </p>
          <div className="admin-form-grid">
            <FormField control={form.control} name="github_url" render={({ field }) => (
              <FormItem><FormLabel>GitHub</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="linkedin_url" render={({ field }) => (
              <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="public_email" render={({ field }) => (
              <FormItem><FormLabel>E-mail publico</FormLabel><FormControl><Input type="email" placeholder="voce@email.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="site_url" render={({ field }) => (
              <FormItem><FormLabel>URL do site</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="location" render={({ field }) => (
              <FormItem><FormLabel>Localizacao</FormLabel><FormControl><Input placeholder="Cidade, Estado" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="availability" render={({ field }) => (
              <FormItem><FormLabel>Disponibilidade</FormLabel><FormControl><Input placeholder="Disponibilidade imediata" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="resume_path" render={({ field }) => (
              <FormItem><FormLabel>Caminho do curriculo</FormLabel><FormControl><Input placeholder="/curriculo" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default AdminSite;


