import { useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminAbout, useUpdateAbout } from "@/hooks/use-admin-api";
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
  const { data, isLoading } = useAdminAbout();
  const updateMutation = useUpdateAbout();

  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: { about_text: "", about_secondary: "" },
  });

  useEffect(() => {
    if (data) {
      form.reset({ about_text: data.about_text || "", about_secondary: data.about_secondary || "" });
    }
  }, [data, form]);

  const handleSubmit = async (formData: AboutFormData) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
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
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default AdminAbout;
