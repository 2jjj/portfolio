import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Download,
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
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
};

type JobsFile = { at: string | null; count: number; jobs: Job[] };

const FILTERS = [
  { id: "todos", label: "Todas" },
  { id: "estagio", label: "Estágios" },
  { id: "junior", label: "Júnior" },
  { id: "regiao", label: "Minha região" },
  { id: "remoto", label: "Remoto" },
];

const Vagas = () => {
  const [data, setData] = useState<JobsFile>({ at: null, count: 0, jobs: [] });
  const [filter, setFilter] = useState("todos");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Vagas - Pedro Sakamoto";
    fetch(`/jobs.json?t=${Date.now()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload && Array.isArray(payload.jobs)) setData(payload);
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
          <div className="section-label">Vagas</div>
          <h1 className="vagas-title">
            Estágios e vagas
            <span> filtrados pelo seu perfil</span>
          </h1>
          <p className="vagas-sub">
            Lista gerada pelo StartANewDay a partir de fontes públicas de vagas. O score compara
            stack, senioridade, região e modalidade com o meu perfil — e cada linha aponta para o
            anúncio original.
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
                Rode o StartANewDay, busque vagas e o arquivo será atualizado automaticamente
                aqui.
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
                      <span className="vaga-score">{job.score}%</span>
                    </div>

                    <div className="vaga-tags">
                      {job.kind === "estagio" && <span>estágio</span>}
                      {job.kind === "junior" && <span>júnior</span>}
                      {job.region && <span className="ok">na região</span>}
                      {job.remote && <span>remoto</span>}
                      {job.salary && <span>{job.salary}</span>}
                      {job.posted && <span>{job.posted}</span>}
                      {job.applied && <span className="ok">candidatado</span>}
                      {job.blocked && <span>RPA indisponível</span>}
                    </div>

                    {(job.why || job.about) && <p className="vaga-why">{job.why || job.about}</p>}
                  </div>

                  <div className="vaga-actions">
                    <a className="btn btn-primary" href={job.url} target="_blank" rel="noreferrer">
                      <ExternalLink size={15} /> Abrir vaga
                    </a>
                    <Link className="btn btn-outline" to="/projetos/startanewday">
                      <Sparkles size={15} /> Como o match é calculado
                    </Link>
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
        </div>
      </main>
    </>
  );
};

export default Vagas;
