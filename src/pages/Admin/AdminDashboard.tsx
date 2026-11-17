import { Link } from "react-router-dom";
import { FolderKanban, User, Wrench, Eye, ExternalLink, FileText, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/admin-api";
import { useSavedJobs } from "@/hooks/use-career";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboard = () => {
  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["admin", "projects", "all"],
    queryFn: () => api.projects.listAll(),
    staleTime: 1000 * 30,
  });

  const { data: skills, isLoading: loadingSkills } = useQuery({
    queryKey: ["admin", "skills"],
    queryFn: () => api.skills.get(),
    staleTime: 1000 * 30,
  });

  const { data: savedJobs, isLoading: loadingJobs } = useSavedJobs();

  const loading = loadingProjects || loadingSkills || loadingJobs;

  const cards = [
    {
      label: "Carreira / Vagas",
      value: savedJobs?.length ?? 0,
      icon: Briefcase,
      link: "/admin/carreira",
      color: "#00FF88",
    },
    {
      label: "Projetos",
      value: projects?.length ?? 0,
      icon: FolderKanban,
      link: "/admin/projetos",
      color: "#00D4FF",
    },
    {
      label: "Skills",
      value: skills?.length ?? 0,
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
