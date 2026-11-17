import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Download,
  ExternalLink,
  RefreshCw,
  Search,
} from "lucide-react";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  region: boolean;
  kind: "estagio" | "junior" | "outros" | string;
  score: number;
  url: string;
  applied: boolean;
  blocked: string;
  salary: string;
  posted: string;
  seniority: string;
  emails: string[];
  why: string;
  about: string;
  source?: string;
  postedAt?: string | null;
};

type JobsFile = { at: string | null; count: number; jobs: Job[] };

type FreelanceItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  level: string;
  score: number;
  proposals: number;
  interested: number;
  publishedAt: string | null;
  why: string;
};

type FreelanceFile = { at: string | null; count: number; items: FreelanceItem[] };

const FILTERS = [
  { id: "todos", label: "Todas" },
  { id: "estagio", label: "Estágios" },
  { id: "junior", label: "Júnior" },
  { id: "regiao", label: "Minha região" },
  { id: "remoto", label: "Remoto" },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const useCountUp = (target: number, durationMs = 900) => {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (target <= 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = clamp((now - start) / durationMs, 0, 1);
      const eased = 1 - Math.pow(2, -10 * elapsed);
      setValue(Math.round(target * (elapsed === 1 ? 1 : eased / (2 - Math.pow(2, -10)))));
      if (elapsed < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, durationMs]);

  return value;
};

const ScoreValue = ({ score }: { score: number }) => {
  const value = useCountUp(score);
  return <span className="vaga-score">{value}%</span>;
};

const Vagas = () => {
  const [data, setData] = useState<JobsFile>({ at: null, count: 0, jobs: [] });
  const [freelance, setFreelance] = useState<FreelanceFile>({ at: null, count: 0, items: [] });
  const [filter, setFilter] = useState("todos");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Vagas — Pedro Sakamoto";
    fetch(`/jobs.json?t=${Date.now()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload && Array.isArray(payload.jobs)) setData(payload);
      })
      .catch(() => {});
    fetch(`/freelance.json?t=${Date.now()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload && Array.isArray(payload.items)) setFreelance(payload);
      })
      .catch(() => {});
  }, []);

  const jobs = useMemo(() => {
    const term = query.trim().toLowerCase();
    return data.jobs.filter((job) => {
      if (filter === "estagio" && job.kind !== "estagio") return false;
      if (filter === "junior" && job.kind !== "junior") return false;
      if (filter === "regiao" && !job.region) return false;
      if (filter === "remoto" && !job.remote) return false;
      if (!term) return true;
      return `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(term);
    });
  }, [data.jobs, filter, query]);

  const freelanceItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return freelance.items;
    return freelance.items.filter((item) =>
      `${item.title} ${item.category} ${item.level}`.toLowerCase().includes(term),
    );
  }, [freelance.items, query]);

  const updated = data.at ? new Date(data.at).toLocaleString("pt-BR") : null;

  return (
    <>
      <header className="case-topbar">
        <Link to="/" className="navbar-brand" aria-label="Voltar para o início">
          PS.
        </Link>
        <div className="resume-topbar-actions">
          <Link to="/" className="case-back">
            <ArrowLeft size={16} /> Início
          </Link>
          <a className="btn btn-outline" href="/curriculo/curriculo-pedro-sakamoto.pdf" download>
            <Download size={16} /> CV PT
          </a>
          <a className="btn btn-outline" href="/curriculo/resume-pedro-sakamoto-en.pdf" download>
            <Download size={16} /> CV EN
          </a>
        </div>
      </header>

      <main className="vagas-page">
        <div className="section-inner">
          <div className="section-label">Oportunidades</div>
          <h1 className="vagas-title">
            Estágios e vagas
            <span> que cabem na minha agenda</span>
          </h1>
          <p className="vagas-sub">
            Lista gerada pelo StartANewDay a partir de fontes públicas. O número ao lado é a
            aderência do anúncio ao meu perfil — stack, senioridade, região e modalidade —
            e cada linha aponta para o anúncio original.{" "}
            <Link className="vagas-how" to="/projetos/startanewday">
              Como o match é calculado
            </Link>
          </p>

          <div className="vagas-toolbar">
            <label className="vagas-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cargo, empresa ou cidade"
                aria-label="Buscar vaga"
              />
            </label>
            <div className="vagas-filters" aria-label="Filtrar vagas">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={filter === item.id ? "active" : ""}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <span className="vagas-count">
              {jobs.length} de {data.count}
              {updated ? ` · atualizado ${updated}` : ""}
            </span>
          </div>

          {!data.jobs.length ? (
            <div className="vagas-empty">
              <Briefcase size={28} />
              <h2>Nenhuma vaga sincronizada ainda</h2>
              <p>
                Rode o StartANewDay, busque vagas e o arquivo será atualizado automaticamente aqui.
              </p>
            </div>
          ) : !jobs.length ? (
            <div className="vagas-empty">
              <Search size={28} />
              <h2>Nada com esses filtros</h2>
              <p>Troque o filtro ou limpe a busca.</p>
            </div>
          ) : (
            <div className="vagas-list">
              {jobs.map((job) => (
                <article key={`${job.id}-${job.url}`} className={`vaga-card ${job.kind === "estagio" ? "is-intern" : ""}`}>
                  <div className="vaga-main">
                    <div className="vaga-head">
                      <span className="vaga-avatar" aria-hidden="true">
                        {(job.company || job.title || "?").slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <h2>{job.title}</h2>
                        <p>
                          {job.company}
                          {job.location ? ` · ${job.location}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="vaga-tags">
                      {job.kind === "estagio" && <span>estágio</span>}
                      {job.kind === "junior" && <span>júnior</span>}
                      {job.region && <span className="ok">na região</span>}
                      {job.remote && <span>remoto</span>}
                      {job.source && job.source !== "linkedin" && <span>{job.source}</span>}
                      {job.salary && <span>{job.salary}</span>}
                      {job.posted && <span>{job.posted}</span>}
                      {job.applied && <span className="ok">candidatado</span>}
                      {job.blocked && <span>RPA indisponível</span>}
                    </div>

                    {(job.why || job.about) && <p className="vaga-why">{job.why || job.about}</p>}
                  </div>

                  <div className="vaga-actions">
                    <ScoreValue score={job.score} />
                    <a className="btn btn-primary" href={job.url} target="_blank" rel="noreferrer">
                      <ExternalLink size={15} /> Abrir vaga
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="vagas-note">
            <RefreshCw size={14} /> Página estática publicada pelo pipeline do StartANewDay
            {updated ? ` — atualizada em ${updated}` : ""}. Nada é enviado automaticamente: cada
            vaga abre no anúncio original.
          </div>

          <div className="freelance-rule" />
          <div className="section-label">Freela</div>
          <h2 className="vagas-title" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)" }}>
            Projetos abertos no 99Freelas
            <span> prontos para proposta</span>
          </h2>
          <p className="vagas-sub">
            Projetos coletados do 99Freelas pelo StartANewDay, ordenados por aderência à minha
            stack, recência e concorrência. Cada linha abre o anúncio original.
          </p>

          {!freelance.items.length ? (
            <div className="vagas-empty">
              <Briefcase size={28} />
              <h2>Nenhum projeto sincronizado ainda</h2>
              <p>Rode a busca do 99Freelas no StartANewDay e o arquivo é atualizado aqui.</p>
            </div>
          ) : !freelanceItems.length ? (
            <div className="vagas-empty">
              <Search size={28} />
              <h2>Nada com esses filtros</h2>
              <p>Limpe a busca para ver todos os projetos.</p>
            </div>
          ) : (
            <div className="vagas-list">
              {freelanceItems.map((item) => (
                <article key={item.id} className="vaga-card">
                  <div className="vaga-main">
                    <div className="vaga-head">
                      <span className="vaga-avatar" aria-hidden="true">
                        {(item.title || "?").slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <h2>{item.title}</h2>
                        <p>
                          {item.category || "projeto"}
                          {item.level ? ` · ${item.level}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="vaga-tags">
                      <span>{item.proposals} propostas</span>
                      {item.interested ? <span>{item.interested} interessados</span> : null}
                    </div>

                    {(item.why || item.description) && (
                      <p className="vaga-why">{item.why || item.description}</p>
                    )}
                  </div>

                  <div className="vaga-actions">
                    <ScoreValue score={item.score} />
                    <a className="btn btn-primary" href={item.url} target="_blank" rel="noreferrer">
                      <ExternalLink size={15} /> Abrir projeto
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Vagas;
