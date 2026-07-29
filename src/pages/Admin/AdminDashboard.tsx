import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, User, Wrench, Eye, ExternalLink, FileText } from "lucide-react";
import { api } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStats {
  projects: number;
  skills: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({ projects: 0, skills: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([api.projects.list(), api.skills.get()])
      .then(([projects, skills]) => {
        setStats({ projects: projects.length, skills: skills.length });
      })
      .catch((err) => {
        toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao carregar dados", variant: "destructive" });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = [
    {
      label: "Projetos",
      value: stats.projects,
      icon: FolderKanban,
      link: "/admin/projetos",
      color: "#00D4FF",
    },
    {
      label: "Skills",
      value: stats.skills,
      icon: Wrench,
      link: "/admin/skills",
      color: "#7B2FFF",
    },
    {
      label: "Sobre",
      value: "Editar",
      icon: User,
      link: "/admin/sobre",
      color: "#FF6B35",
    },
    {
      label: "Curriculo",
      value: "Gerar",
      icon: FileText,
      link: "/admin/curriculo",
      color: "#00FF88",
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <a href="/" target="_blank" rel="noreferrer" className="admin-btn admin-btn-ghost">
          <Eye size={16} />
          Ver site
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="admin-stats">
        {cards.map((card) => (
          <Link to={card.link} key={card.label}>
            <Card className="admin-stat-card-hover">
              <CardContent className="flex items-center gap-4 p-5">
                {loading ? (
                  <>
                    <Skeleton className="h-11 w-11 rounded-[10px]" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="admin-stat-icon" style={{ background: `${card.color}22`, color: card.color }}>
                      <card.icon size={24} />
                    </div>
                    <div>
                      <div className="admin-stat-value">{card.value}</div>
                      <div className="admin-stat-label">{card.label}</div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
