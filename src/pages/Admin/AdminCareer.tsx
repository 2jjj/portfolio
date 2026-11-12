import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Trash2,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminSite, useAdminProjectsAll } from "@/hooks/use-admin-api";
import {
  useDeleteSavedJob,
  useJobSearch,
  useSaveJob,
  useSavedJobs,
  useUpdateSavedJob,
} from "@/hooks/use-career";
import type { CareerLinks, JobResult, JobSourceStatus, JobStatus, SavedJob } from "@/types";
import { JOB_STATUSES, SOURCE_LABELS, STATUS_LABELS } from "@/lib/application-kit";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import JobCard from "@/components/admin/JobCard";
import JobDetailPanel from "@/components/admin/JobDetailPanel";

const SOURCE_OPTIONS = [
  { id: "remotive", label: "Remotive" },
  { id: "jobicy", label: "Jobicy" },
  { id: "arbeitnow", label: "Arbeitnow" },
  { id: "remoteok", label: "Remote OK" },
];

const DEFAULT_LINKS: CareerLinks = {
  github: "https://github.com/2jjj",
  linkedin: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
  email: "pedrosakamoto27@gmail.com",
  site: "https://www.pedrosakamoto.site",
  resume: "https://www.pedrosakamoto.site/curriculo",
  location: "Ribeirão Preto, SP",
  availability: "Disponibilidade imediata",
};

function jobFromSaved(saved: SavedJob): JobResult {
  return {
    id: saved.external_id,
    source: saved.source,
    title: saved.title,
    company: saved.company,
    url: saved.url,
    applyUrl: saved.apply_url || saved.url,
    location: saved.location,
    remote: saved.remote,
    salary: saved.salary,
    tags: saved.tags,
    description: saved.description,
    publishedAt: saved.created_at,
    matchScore: saved.match_score,
    matchedSkills: saved.matched_skills,
    missingSkills: saved.missing_skills,
    topProjects: saved.top_projects || [],
  };
}

const AdminCareer = () => {
  const { data: siteData } = useAdminSite();
  const { data: projects } = useAdminProjectsAll();
  const { data: savedJobs, isLoading: loadingSaved } = useSavedJobs();
  const searchMutation = useJobSearch();
  const saveMutation = useSaveJob();
  const updateMutation = useUpdateSavedJob();
  const deleteMutation = useDeleteSavedJob();

  const [tab, setTab] = useState<"search" | "pipeline">("search");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Brasil");
  const [remoteOnly, setRemoteOnly] = useState(true);
  const [selectedSources, setSelectedSources] = useState<string[]>(SOURCE_OPTIONS.map((source) => source.id));
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [selectedJob, setSelectedJob] = useState<JobResult | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [sourcesStatus, setSourcesStatus] = useState<JobSourceStatus[]>([]);
  const autoSearch = useRef(false);

  const links = useMemo<CareerLinks>(() => {
    const siteUrl = String(siteData?.site_url || DEFAULT_LINKS.site).replace(/\/$/, "");
    const resumePath = String(siteData?.resume_path || "/curriculo");
    const resumeUrl = /^https?:\/\//i.test(resumePath)
      ? resumePath
      : `${siteUrl}${resumePath.startsWith("/") ? "" : "/"}${resumePath}`;
    return {
      github: siteData?.github_url || DEFAULT_LINKS.github,
      linkedin: siteData?.linkedin_url || DEFAULT_LINKS.linkedin,
      email: siteData?.public_email || DEFAULT_LINKS.email,
      site: siteUrl,
      resume: resumeUrl,
      location: siteData?.location || DEFAULT_LINKS.location,
      availability: siteData?.availability || DEFAULT_LINKS.availability,
    };
  }, [siteData]);

  const { mutate: runSearch } = searchMutation;

  const performSearch = useCallback(() => {
    runSearch(
      {
        q: query.trim(),
        location: location.trim(),
        remote: remoteOnly,
        sources: selectedSources.length === SOURCE_OPTIONS.length ? [] : selectedSources,
        limit: 40,
      },
      {
        onSuccess: (data) => setSourcesStatus(data.sources),
      }
    );
  }, [runSearch, query, location, remoteOnly, selectedSources]);

  useEffect(() => {
    if (autoSearch.current) return;
    autoSearch.current = true;
    runSearch(
      { q: "", location: "Brasil", remote: true, sources: [], limit: 40 },
      { onSuccess: (data) => setSourcesStatus(data.sources) }
    );
  }, [runSearch]);

  const jobs = searchMutation.data?.jobs || [];
  const saved = useMemo(() => savedJobs || [], [savedJobs]);
  const savedById = useMemo(() => {
    const map = new Map<string, SavedJob>();
    for (const item of saved) map.set(`${item.source}:${item.external_id}`, item);
    return map;
  }, [saved]);

  const selectedSaved = selectedJob
    ? savedById.get(`${selectedJob.source}:${selectedJob.id}`) || null
    : null;

  const filteredSaved = statusFilter === "all"
    ? saved
    : saved.filter((item) => item.status === statusFilter);

  const stats = useMemo(() => ({
    total: saved.length,
    applied: saved.filter((item) => item.status === "applied").length,
    interview: saved.filter((item) => item.status === "interview").length,
    offer: saved.filter((item) => item.status === "offer").length,
  }), [saved]);

  const readiness = useMemo(() => {
    const linkChecks = [links.github, links.linkedin, links.email, links.site, links.resume];
    const linkScore = linkChecks.filter(Boolean).length * 12;
    const projectScore = (projects?.length || 0) >= 3 ? 20 : (projects?.length || 0) * 6;
    const skillScore = (siteData?.skills?.length || 0) >= 8 ? 20 : (siteData?.skills?.length || 0) * 2;
    return Math.min(100, linkScore + projectScore + skillScore);
  }, [links, projects, siteData]);

  const handleToggleSource = (source: string) => {
    setSelectedSources((current) => {
      if (current.includes(source)) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== source);
      }
      return [...current, source];
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTab("search");
    performSearch();
  };

  const openJob = (job: JobResult) => {
    setSelectedJob(job);
    setDetailOpen(true);
  };

  const saveJob = async (job: JobResult) => {
    const existing = savedById.get(`${job.source}:${job.id}`);
    if (existing) {
      toast.info("Essa vaga ja esta no pipeline");
      return;
    }
    try {
      await saveMutation.mutateAsync(job);
    } catch {
      return;
    }
  };

  const applyJob = async (job: JobResult) => {
    window.open(job.applyUrl || job.url, "_blank", "noopener,noreferrer");
    if (!savedById.get(`${job.source}:${job.id}`)) {
      try {
        await saveMutation.mutateAsync(job);
        toast.success("Vaga salva no pipeline. Marque como aplicada depois de enviar.");
      } catch {
        return;
      }
      return;
    }
    toast.success("Vaga aberta. Marque como aplicada depois de enviar.");
  };

  const updateStatus = (status: JobStatus) => {
    if (!selectedSaved) return;
    updateMutation.mutate({ id: selectedSaved.id, data: { status } });
  };

  const saveNotes = (notes: string, nextAction: string | null) => {
    if (!selectedSaved) return;
    updateMutation.mutate({
      id: selectedSaved.id,
      data: { notes, next_action_at: nextAction },
    });
  };

  const removeSaved = () => {
    if (!selectedSaved) return;
    if (!window.confirm(`Remover "${selectedSaved.title}" do pipeline?`)) return;
    deleteMutation.mutate(selectedSaved.id, {
      onSuccess: () => {
        setDetailOpen(false);
        setSelectedJob(null);
      },
    });
  };

  const markApplied = (item: SavedJob) => {
    updateMutation.mutate({ id: item.id, data: { status: "applied" } });
  };

  const linksConfigured = [links.github, links.linkedin, links.email, links.site, links.resume].filter(Boolean).length;

  return (
    <div className="admin-career animate-fade-in">
      <header className="career-hero">
        <div className="career-hero-copy">
          <div className="career-eyebrow"><Sparkles size={14} /> Career HQ</div>
          <h1>Encontre a vaga. Linke tudo. Aplique.</h1>
          <p>
            Busca em quatro fontes, match com o portfolio e um kit pronto com LinkedIn,
            GitHub, curriculo e projetos. O pipeline guarda o resto.
          </p>
          <div className="career-hero-actions">
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="admin-btn admin-btn-ghost">
              <Linkedin size={15} /> LinkedIn
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" className="admin-btn admin-btn-ghost">
              <Github size={15} /> GitHub
            </a>
            <a href={links.resume} target="_blank" rel="noreferrer" className="admin-btn admin-btn-ghost">
              <FileText size={15} /> Curriculo
            </a>
          </div>
        </div>

        <div className="career-readiness" aria-label={`Prontidao do perfil: ${readiness}%`}>
          <div className="career-readiness-head">
            <span><Target size={15} /> Prontidao</span>
            <strong>{readiness}%</strong>
          </div>
          <div className="career-readiness-bar">
            <span style={{ width: `${readiness}%` }} />
          </div>
          <ul>
            <li className={linksConfigured === 5 ? "ok" : ""}><CheckCircle2 size={13} /> {linksConfigured}/5 links configurados</li>
            <li className={(projects?.length || 0) >= 3 ? "ok" : ""}><CheckCircle2 size={13} /> {projects?.length || 0} projetos no portfolio</li>
            <li className={(siteData?.skills?.length || 0) >= 8 ? "ok" : ""}><CheckCircle2 size={13} /> {siteData?.skills?.length || 0} skills publicadas</li>
          </ul>
          <a href="/admin/site" className="career-readiness-link">Editar links <ArrowRight size={13} /></a>
        </div>
      </header>

      <div className="career-stats">
        <div className="career-stat"><span><Briefcase size={15} /> Pipeline</span><strong>{stats.total}</strong></div>
        <div className="career-stat"><span><CheckCircle2 size={15} /> Aplicadas</span><strong>{stats.applied}</strong></div>
        <div className="career-stat"><span><Target size={15} /> Entrevistas</span><strong>{stats.interview}</strong></div>
        <div className="career-stat"><span><CircleDollarSign size={15} /> Ofertas</span><strong>{stats.offer}</strong></div>
      </div>

      <div className="career-tabs" role="tablist" aria-label="Secoes da carreira">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "search"}
          className={tab === "search" ? "active" : ""}
          onClick={() => setTab("search")}
        >
          <Search size={15} /> Buscar vagas
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "pipeline"}
          className={tab === "pipeline" ? "active" : ""}
          onClick={() => setTab("pipeline")}
        >
          <Briefcase size={15} /> Pipeline <span>{saved.length}</span>
        </button>
      </div>

      {tab === "search" ? (
        <>
          <form className="career-search" onSubmit={handleSubmit}>
            <div className="career-search-main">
              <div className="career-input career-input-grow">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cargo, stack ou empresa"
                  aria-label="Buscar vaga por cargo, stack ou empresa"
                />
              </div>
              <div className="career-input">
                <MapPin size={16} />
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Brasil, LATAM, remoto"
                  aria-label="Localizacao da vaga"
                />
              </div>
              <button type="submit" className="admin-btn career-search-btn" disabled={searchMutation.isPending}>
                {searchMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Buscar
              </button>
            </div>

            <div className="career-search-filters">
              <label className="career-switch">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(event) => setRemoteOnly(event.target.checked)}
                />
                <span><Wifi size={14} /> So remoto</span>
              </label>
              <div className="career-source-chips" aria-label="Fontes de vagas">
                {SOURCE_OPTIONS.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    className={selectedSources.includes(source.id) ? "active" : ""}
                    onClick={() => handleToggleSource(source.id)}
                    aria-pressed={selectedSources.includes(source.id)}
                  >
                    {source.label}
                  </button>
                ))}
              </div>
              <button type="button" className="career-refresh" onClick={performSearch} disabled={searchMutation.isPending}>
                <RefreshCw size={14} className={searchMutation.isPending ? "animate-spin" : ""} /> Atualizar
              </button>
            </div>
          </form>

          <div className="career-search-meta">
            <span>
              {searchMutation.isPending
                ? "Varrendo as fontes..."
                : `${searchMutation.data?.total || 0} vagas encontradas`}
            </span>
            <div className="career-source-status">
              {sourcesStatus.map((source) => (
                <span key={source.source} className={source.ok ? "ok" : "fail"} title={source.error}>
                  {SOURCE_LABELS[source.source] || source.source}: {source.ok ? source.count : "off"}
                </span>
              ))}
            </div>
          </div>

          {searchMutation.isPending ? (
            <div className="career-job-list">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : searchMutation.isError ? (
            <div className="career-empty">
              <Search size={30} />
              <h2>Nao foi possivel buscar agora</h2>
              <p>Tente novamente. As fontes externas podem estar limitando requisicoes.</p>
              <button type="button" className="admin-btn" onClick={performSearch}>Tentar de novo</button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="career-empty">
              <Search size={30} />
              <h2>Nenhuma vaga com esses filtros</h2>
              <p>Tire o filtro de remoto, mude a localizacao ou busque por outra stack.</p>
            </div>
          ) : (
            <div className="career-job-list">
              {jobs.map((job) => (
                <JobCard
                  key={`${job.source}:${job.id}`}
                  job={job}
                  saved={savedById.has(`${job.source}:${job.id}`)}
                  onOpen={openJob}
                  onSave={saveJob}
                  onApply={applyJob}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <section className="career-pipeline">
          <div className="career-pipeline-head">
            <div>
              <h2>Seu pipeline</h2>
              <p>Salve, acompanhe e nao perca o proximo passo.</p>
            </div>
            <div className="career-status-filters" aria-label="Filtrar por status">
              <button
                type="button"
                className={statusFilter === "all" ? "active" : ""}
                onClick={() => setStatusFilter("all")}
              >
                Todas <span>{saved.length}</span>
              </button>
              {JOB_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={statusFilter === status ? "active" : ""}
                  onClick={() => setStatusFilter(status)}
                >
                  {STATUS_LABELS[status]} <span>{saved.filter((item) => item.status === status).length}</span>
                </button>
              ))}
            </div>
          </div>

          {loadingSaved ? (
            <div className="career-job-list">
              {Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-32 w-full rounded-xl" />)}
            </div>
          ) : filteredSaved.length === 0 ? (
            <div className="career-empty">
              <Briefcase size={30} />
              <h2>Pipeline vazio</h2>
              <p>Busque vagas e salve as melhores para acompanhar aqui.</p>
              <button type="button" className="admin-btn" onClick={() => setTab("search")}>Buscar vagas</button>
            </div>
          ) : (
            <div className="career-pipeline-list">
              {filteredSaved.map((item) => (
                <article key={item.id} className="pipeline-card">
                  <div className="pipeline-card-main">
                    <div className="pipeline-card-top">
                      <span className={`pipeline-status status-${item.status}`}>{STATUS_LABELS[item.status]}</span>
                      <span className="job-source">{SOURCE_LABELS[item.source] || item.source}</span>
                      {item.remote && <span className="job-detail-remote"><Wifi size={12} /> Remoto</span>}
                    </div>
                    <button
                      type="button"
                      className="pipeline-title"
                      onClick={() => openJob(jobFromSaved(item))}
                    >
                      {item.title}
                    </button>
                    <p className="pipeline-company"><Building2 size={13} /> {item.company}</p>
                    <div className="pipeline-meta">
                      {item.location && <span><MapPin size={12} /> {item.location}</span>}
                      {item.salary && <span>{item.salary}</span>}
                      {item.next_action_at && (
                        <span className="pipeline-next">
                          Proximo passo: {new Date(item.next_action_at).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                    {item.notes && <p className="pipeline-notes">{item.notes}</p>}
                  </div>
                  <div className="pipeline-card-side">
                    <div className="pipeline-score">{item.match_score}% match</div>
                    <div className="pipeline-actions">
                      <button
                        type="button"
                        className="admin-btn-icon"
                        onClick={() => window.open(item.apply_url || item.url, "_blank", "noopener,noreferrer")}
                        aria-label={`Abrir vaga ${item.title}`}
                        title="Abrir vaga"
                      >
                        <ExternalLink size={16} />
                      </button>
                      {item.status === "saved" && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost pipeline-apply"
                          onClick={() => markApplied(item)}
                        >
                          <CheckCircle2 size={14} /> Aplicada
                        </button>
                      )}
                      <button
                        type="button"
                        className="admin-btn-icon danger"
                        onClick={() => {
                          if (window.confirm(`Remover "${item.title}" do pipeline?`)) deleteMutation.mutate(item.id);
                        }}
                        aria-label={`Remover ${item.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" className="career-sheet">
          <SheetTitle className="sr-only">Detalhes da vaga</SheetTitle>
          <SheetDescription className="sr-only">
            Match, application kit, links e pipeline da vaga selecionada.
          </SheetDescription>
          {selectedJob && (
            <JobDetailPanel
              job={selectedJob}
              saved={selectedSaved}
              links={links}
              isSaving={saveMutation.isPending || updateMutation.isPending}
              onSave={saveJob}
              onApply={applyJob}
              onStatusChange={updateStatus}
              onNotesSave={saveNotes}
              onDelete={removeSaved}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminCareer;
