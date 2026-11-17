import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Wifi } from "lucide-react";
import type { JobResult } from "@/types";
import { SOURCE_LABELS, formatRelativeDate } from "@/lib/application-kit";
import MatchRing from "./MatchRing";

interface JobCardProps {
  job: JobResult;
  saved?: boolean;
  onOpen: (job: JobResult) => void;
  onSave: (job: JobResult) => void;
  onApply: (job: JobResult) => void;
}

const JobCard = ({ job, saved, onOpen, onSave, onApply }: JobCardProps) => {
  return (
    <article className="job-card">
      <div className="job-card-main">
        <div className="job-card-top">
          <span className={`job-source job-source-${job.source}`}>{SOURCE_LABELS[job.source] || job.source}</span>
          <span className="job-age">{formatRelativeDate(job.publishedAt)}</span>
        </div>

        <button type="button" className="job-title-button" onClick={() => onOpen(job)}>
          <h3>{job.title}</h3>
          <span>{job.company}</span>
        </button>

        <div className="job-card-meta">
          {job.location && <span><MapPin size={13} /> {job.location}</span>}
          {job.remote && <span><Wifi size={13} /> Remoto</span>}
          {job.salary && <span className="job-salary">{job.salary}</span>}
        </div>

        {job.tags.length > 0 && (
          <div className="job-tags">
            {job.tags.slice(0, 5).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
            {job.tags.length > 5 && <span>+{job.tags.length - 5}</span>}
          </div>
        )}

        {job.matchedSkills.length > 0 && (
          <div className="job-match-line">
            <span className="job-match-label">Bate com</span>
            {job.matchedSkills.slice(0, 4).map((skill) => (
              <span key={skill} className="job-match-skill">{skill}</span>
            ))}
          </div>
        )}
      </div>

      <div className="job-card-side">
        <MatchRing value={job.matchScore} />
        <div className="job-card-actions">
          <button
            type="button"
            className="admin-btn-icon"
            onClick={() => onSave(job)}
            aria-label={saved ? "Vaga ja salva" : "Salvar vaga"}
            title={saved ? "Ja salva no pipeline" : "Salvar no pipeline"}
          >
            {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
          </button>
          <button
            type="button"
            className="admin-btn-icon"
            onClick={() => onApply(job)}
            aria-label="Abrir vaga e aplicar"
            title="Abrir vaga e aplicar"
          >
            <ExternalLink size={17} />
          </button>
        </div>
        <button type="button" className="job-detail-link" onClick={() => onOpen(job)}>
          Ver kit
        </button>
      </div>
    </article>
  );
};

export default JobCard;
