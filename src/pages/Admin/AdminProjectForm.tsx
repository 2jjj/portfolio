import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Github } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminProject, useCreateProject, useUpdateProject } from "@/hooks/use-admin-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GitHubImportModal from "@/components/GitHubImportModal";

const categories = ["Back-End", "Front-End", "Full Stack", "DevOps", "Mobile", "Outro"] as const;

const projectSchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio").max(80, "Maximo 80 caracteres"),
  description: z.string().max(500, "Maximo 500 caracteres").optional().default(""),
  category: z.enum(categories),
  tags: z.string().optional().default(""),
  image: z.string().url("URL invalida").optional().or(z.literal("")).default(""),
  github: z.string().url("URL invalida").optional().or(z.literal("")).default(""),
  live: z.string().url("URL invalida").optional().or(z.literal("")).default(""),
  featured: z.boolean().default(false),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const AdminProjectForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id && id !== "novo");
  const navigate = useNavigate();
  const [githubModalOpen, setGithubModalOpen] = useState(false);

  const { data: project, isLoading: loadingProject } = useAdminProject(isEditing ? Number(id) : 0);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", description: "", category: "Back-End", tags: "", image: "", github: "", live: "", featured: false },
  });

  useEffect(() => {
    if (project && isEditing) {
      form.reset({
        title: project.title,
        description: project.description,
        category: project.category as ProjectFormData["category"],
        tags: (project.tags || []).join(", "),
        image: project.image || "",
        github: project.github || "",
        live: project.live || "",
        featured: Boolean(project.featured),
      });
    }
  }, [project, isEditing, form]);

  const handleSubmit = async (data: ProjectFormData) => {
    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      image: data.image.trim(),
      github: data.github.trim(),
      live: data.live.trim(),
      featured: data.featured ? 1 : 0,
    };

    if (isEditing && id) {
      updateMutation.mutate({ id: Number(id), data: payload }, {
        onSuccess: () => navigate("/admin/projetos"),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate("/admin/projetos"),
      });
    }
  };

  const handleGitHubImport = (data: { title: string; description: string; category: string; tags: string[]; image: string; github: string; live: string }) => {
    form.reset({
      title: data.title,
      description: data.description,
      category: data.category as ProjectFormData["category"],
      tags: data.tags.join(", "),
      image: data.image,
      github: data.github,
      live: data.live,
      featured: false,
    });
  };

  if (loadingProject && isEditing) {
    return (
      <div className="animate-fade-in">
        <div className="admin-header"><Skeleton className="h-10 w-24" /><h1>Editar Projeto</h1></div>
        <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-24 w-full" /></div>
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="animate-fade-in">
      <div className="admin-header">
        <button onClick={() => navigate("/admin/projetos")} className="admin-btn admin-btn-ghost"><ArrowLeft size={16} /> Voltar</button>
        <h1>{isEditing ? "Editar Projeto" : "Novo Projeto"}</h1>
        {!isEditing && (<button type="button" className="admin-btn admin-btn-ghost" onClick={() => setGithubModalOpen(true)}><Github size={16} /> Importar do GitHub</button>)}
      </div>
      <GitHubImportModal open={githubModalOpen} onClose={() => setGithubModalOpen(false)} onImport={handleGitHubImport} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="admin-form">
          <div className="admin-form-grid">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Titulo *</FormLabel><FormControl><Input placeholder="Nome do projeto" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem><FormLabel>Categoria</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <div className="admin-field-full"><FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Descricao</FormLabel><FormControl><Textarea placeholder="Descricao do projeto..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
            )} /></div>
            <div className="admin-field-full"><FormField control={form.control} name="tags" render={({ field }) => (
              <FormItem><FormLabel>Tags (separadas por virgula)</FormLabel><FormControl><Input placeholder="React, Node.js, TypeScript" {...field} /></FormControl><FormMessage /></FormItem>
            )} /></div>
            <FormField control={form.control} name="image" render={({ field }) => (
              <FormItem><FormLabel>Imagem (URL)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="github" render={({ field }) => (
              <FormItem><FormLabel>GitHub (URL)</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="live" render={({ field }) => (
              <FormItem><FormLabel>Link Live (URL)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="featured" render={({ field }) => (
              <FormItem><div className="flex items-center gap-2 pt-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0 cursor-pointer">Projeto em destaque</FormLabel></div><FormMessage /></FormItem>
            )} />
          </div>
          <div className="admin-form-actions">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {isEditing ? "Salvar Alteracoes" : "Criar Projeto"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AdminProjectForm;
