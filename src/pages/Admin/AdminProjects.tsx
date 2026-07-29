import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ExternalLink, Github } from "lucide-react";
import { api } from "@/lib/admin-api";
import type { Project } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/EmptyState";

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    api.projects.list().then(setProjects).catch((err) => {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao carregar projetos", variant: "destructive" });
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await api.projects.delete(deleteTarget);
      toast({ title: "Removido", description: "Projeto removido com sucesso." });
      setDeleteTarget(null);
      load();
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao remover projeto", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="admin-header">
          <h1>Projetos</h1>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
      <div className="animate-fade-in">
        <div className="admin-header">
          <h1>Projetos</h1>
          <Link to="/admin/projetos/novo" className="admin-btn">
            <Plus size={16} />
            Novo Projeto
          </Link>
        </div>

      {projects.length === 0 ? (
        <EmptyState message="Nenhum projeto cadastrado." />
      ) : (
        <div className="admin-table-wrapper">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Titulo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Links</TableHead>
                <TableHead>Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.order_index}</TableCell>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell><span className="admin-badge">{p.category}</span></TableCell>
                  <TableCell>
                    <div className="admin-tags">
                      {(p.tags || []).map((t: string) => (
                        <span key={t} className="admin-tag">{t}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="admin-table-links">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a>
                      )}
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noreferrer" aria-label="Link do projeto"><ExternalLink size={16} /></a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="admin-table-actions">
                      <button onClick={() => navigate(`/admin/projetos/${p.id}`)} className="admin-btn-icon" title="Editar" aria-label="Editar projeto">
                        <Pencil size={16} />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button onClick={() => setDeleteTarget(p.id)} className="admin-btn-icon danger" title="Remover" aria-label="Remover projeto">
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover projeto</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover &ldquo;{p.title}&rdquo;? Esta acao nao pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
