import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardCopy,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Search,
  Trash2,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import type { ApplicationKit, CareerLinks, JobResult, JobStatus, SavedJob } from "@/types";
import { JOB_STATUSES, SOURCE_LABELS, STATUS_LABELS, buildApplicationKit } from "@/lib/application-kit";
import MatchRing from "./MatchRing";

const LINK_ICONS = {
  linkedin: Linkedin,
  github: Github,
  mail: Mail,
  globe: Globe,
  file: FileText,
  search: Search,
};

interface JobDetailPanelProps {
  job: JobResult;
  saved: SavedJob | null;
  links: CareerLinks;
  isSaving: boolean;
  onSave: (job: JobResult) => void;
  onApply: (job: JobResult) => void;
  onStatusChange: (status: JobStatus) => void;
  onNotesSave: (notes: string, nextAction: string | null) => void;
  onDelete: () => void;
}

const JobDetailPanel = ({
  job,
  saved,
  links,
  isSaving,
  onSave,
  onApply,
  onStatusChange,
  onNotesSave,
  onDelete,
}: JobDetailPanelProps) => {
  const kit = useMemo<ApplicationKit>(() => buildApplicationKit(job, links), [job, links]);
  const [copied, setCopied] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState(kit.coverLetter);
  const [notes, setNotes] = useState(saved?.notes || "");
  const [nextAction, setNextAction] = useState(
    saved?.next_action_at ? saved.next_action_at.slice(0, 10) : ""
  );
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    setCoverLetter(kit.coverLetter);
    setNotes(saved?.notes || "");
    setNextAction(saved?.next_action_at ? saved.next_action_at.slice(0, 10) : "");
  }, [job.id, kit.coverLetter, saved?.notes, saved?.next_action_at]);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1800);
      toast.success(`${label} copiado`);
    } catch {
      toast.error("Nao foi possivel copiar");
    }
  };

  return (
    <div className="job-detail">
      <header className="job-detail-head">
        <div>
          <div className="job-detail-eyebrow">
            <span className={`job-source job-source-${job.source}`}>{SOURCE_LABELS[job.source] || job.source}</span>
            {job.remote && <span className="job-detail-remote"><Wifi size={13} /> Remoto</span>}
          </div>
          <h2>{job.title}</h2>
          <p className="job-detail-company">{job.company}</p>
          <div className="job-card-meta">
            {job.location && <span><MapPin size={13} /> {job.location}</span>}
            {job.salary && <span className="job-salary">{job.salary}</span>}
          </div>
        </div>
        <MatchRing value={job.matchScore} size={62} />
      </header>

      <div className="job-detail-actions">
        <button type="button" className="admin-btn" onClick={() => onApply(job)}>
          <ExternalLink size={15} /> Aplicar
        </button>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={() => onSave(job)} disabled={isSaving}>
          {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          {saved ? "Salva" : "Salvar"}
        </button>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={() => copy("Carta", coverLetter)}>
          {copied === "Carta" ? <Check size={15} /> : <ClipboardCopy size={15} />} Carta
        </button>
      </div>

      <section className="job-detail-section">
        <div className="job-detail-section-head">
          <h3>Match com seu perfil</h3>
          <span>{job.matchedSkills.length} skills em comum</span>
        </div>
        {job.matchedSkills.length > 0 ? (
          <div className="job-tags job-tags-strong">
            {job.matchedSkills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        ) : (
          <p className="job-detail-muted">Nenhuma skill do seu perfil apareceu na descricao.</p>
        )}
        {job.missingSkills.length > 0 && (
          <div className="job-gaps">
            <span className="job-match-label">Vale estudar</span>
            {job.missingSkills.map((skill) => <span key={skill} className="job-gap">{skill}</span>)}
          </div>
        )}
      </section>

      {job.topProjects.length > 0 && (
        <section className="job-detail-section">
          <div className="job-detail-section-head">
            <h3>Projetos para mostrar</h3>
            <span>Do seu portfolio</span>
          </div>
          <div className="job-projects">
            {job.topProjects.map((project) => (
              <div key={project.slug} className="job-project">
                <div>
                  <strong>{project.title}</strong>
                  <p>{project.matchedTags.join(" · ") || project.tags.join(" · ")}</p>
                </div>
                <div className="job-project-links">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" aria-label={`GitHub de ${project.title}`}>
                      <Github size={15} />
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer" aria-label={`Site de ${project.title}`}>
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="job-detail-section">
        <div className="job-detail-section-head">
          <h3>Application kit</h3>
          <span>Tudo linkado</span>
        </div>
        <div className="job-kit-links">
          {kit.links.map((link) => {
            const Icon = LINK_ICONS[link.icon] || Globe;
            return (
              <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="job-kit-link">
                <Icon size={16} />
                <span>{link.label}</span>
                <ExternalLink size={12} />
              </a>
            );
          })}
        </div>

        <div className="job-kit-block">
          <div className="job-kit-block-head">
            <span>Pitch</span>
            <button type="button" onClick={() => copy("Pitch", kit.pitch)}>
              {copied === "Pitch" ? <Check size={14} /> : <ClipboardCopy size={14} />} copiar
            </button>
          </div>
          <p>{kit.pitch}</p>
        </div>

        <div className="job-kit-block">
          <div className="job-kit-block-head">
            <span>Carta de apresentacao</span>
            <button type="button" onClick={() => copy("Carta", coverLetter)}>
              {copied === "Carta" ? <Check size={14} /> : <ClipboardCopy size={14} />} copiar
            </button>
          </div>
          <textarea
            value={coverLetter}
            onChange={(event) => setCoverLetter(event.target.value)}
            rows={8}
            aria-label="Carta de apresentacao editavel"
          />
        </div>

        <div className="job-kit-block">
          <div className="job-kit-block-head"><span>Checklist</span></div>
          <ul className="job-checklist">
            {kit.checklist.map((item) => (
              <li key={item}><CheckCircle2 size={14} /> {item}</li>
            ))}
          </ul>
        </div>
      </section>

      {saved && (
        <section className="job-detail-section job-pipeline-controls">
          <div className="job-detail-section-head">
            <h3>Pipeline</h3>
            <span>Atualizado {new Date(saved.updated_at).toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="job-pipeline-row">
            <label>
              Status
              <select value={saved.status} onChange={(event) => onStatusChange(event.target.value as JobStatus)}>
                {JOB_STATUSES.map((status) => (
                  <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                ))}
              </select>
            </label>
            <label>
              Proximo passo
              <input type="date" value={nextAction} onChange={(event) => setNextAction(event.target.value)} />
            </label>
          </div>
          <label className="job-notes">
            Anotacoes
            <textarea
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Recrutador, salario, proxima etapa..."
            />
          </label>
          <div className="job-pipeline-actions">
            <button
              type="button"
              className="admin-btn"
              onClick={() => onNotesSave(notes, nextAction ? new Date(`${nextAction}T12:00:00`).toISOString() : null)}
            >
              <CalendarClock size={15} /> Salvar anotacoes
            </button>
            <button type="button" className="admin-btn admin-btn-ghost job-delete" onClick={onDelete}>
              <Trash2 size={15} /> Remover
            </button>
          </div>
        </section>
      )}

      <section className="job-detail-section">
        <button
          type="button"
          className="job-description-toggle"
          onClick={() => setShowDescription((value) => !value)}
          aria-expanded={showDescription}
        >
          <span><Briefcase size={15} /> Descricao da vaga</span>
          <span>{showDescription ? "Fechar" : "Abrir"}</span>
        </button>
        {showDescription && <p className="job-description">{job.description}</p>}
      </section>
    </div>
  );
};

export default JobDetailPanel;
