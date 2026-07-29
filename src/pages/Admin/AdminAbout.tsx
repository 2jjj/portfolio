import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const aboutSchema = z.object({
  about_text: z.string().max(2000, "Maximo 2000 caracteres").optional().default(""),
  about_secondary: z.string().max(2000, "Maximo 2000 caracteres").optional().default(""),
});

type AboutFormData = z.infer<typeof aboutSchema>;

const AdminAbout = () => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: { about_text: "", about_secondary: "" },
  });

  useEffect(() => {
    api.about.get().then((data) => {
      form.reset({ about_text: data.about_text || "", about_secondary: data.about_secondary || "" });
    }).catch(() => {
      toast({ title: "Erro", description: "Erro ao carregar dados", variant: "destructive" });
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (data: AboutFormData) => {
    try {
      await api.about.update(data);
      toast({ title: "Salvo!", description: "Informacoes salvas com sucesso." });
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao salvar", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="admin-header"><h1>Sobre Mim</h1></div>
        <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-28 w-full" /></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="admin-header"><h1>Sobre Mim</h1></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="admin-form">
          <FormField control={form.control} name="about_text" render={({ field }) => (
            <FormItem><FormLabel>Texto Principal</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="about_secondary" render={({ field }) => (
            <FormItem><FormLabel>Texto Secundario</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default AdminAbout;
