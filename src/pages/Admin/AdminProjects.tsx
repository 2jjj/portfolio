import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ExternalLink, Github, GripVertical } from "lucide-react";
import { useAdminProjectsAll, useDeleteProject, useUpdateProjectOrder } from "@/hooks/use-admin-api";
import type { Project } from "@/types";
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
  const { data, isLoading } = useAdminProjectsAll();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [localProjects, setLocalProjects] = useState<Project[] | null>(null);
  const navigate = useNavigate();
  const deleteMutation = useDeleteProject();
  const updateOrderMutation = useUpdateProjectOrder();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === "n" && !e.metaKey && !e.ctrlKey && !target?.closest?.("input,textarea,select")) {
        e.preventDefault();
        navigate("/admin/projetos/novo");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const projects = localProjects || data || [];

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setLocalProjects((prev) => {
      const copy = [...(prev || data || [])];
      const item = copy[dragIndex];
      copy.splice(dragIndex, 1);
      copy.splice(index, 0, item);
      return copy;
    });
    setDragIndex(index);
  }, [dragIndex, data]);

  const handleDragEnd = async () => {
    setDragIndex(null);
    const current = localProjects || projects;
    for (const p of current) {
      const idx = current.indexOf(p);
      updateOrderMutation.mutate({ id: p.id, order_index: idx + 1 });
    }
    setLocalProjects(null);
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    deleteMutation.mutate(deleteTarget, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  if (isLoading) {
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
              {projects.map((p, index) => (
                <TableRow
                  key={p.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{ opacity: dragIndex === index ? 0.5 : 1, cursor: "grab" }}
                >
                  <TableCell>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--text2)" }}>
                      <GripVertical size={14} />
                      {p.order_index}
                    </span>
                  </TableCell>
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
