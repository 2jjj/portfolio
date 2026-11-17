import { Link } from "react-router-dom";
import { SHEET_RUNS, type SheetRun } from "@/lib/sheet";

type Props = { run: SheetRun; index: number };

/**
 * Em destaque — os três cases em blocos grandes, sem tilt e sem carta:
 * linha editorial com número, meta, capa sangrada dentro de frame
 * arredondado e rodapé com o link do caso.
 */
const WorkCase = ({ run, index }: Props) => {
  const unique = [...new Set(run.frames)];
  const poster = unique[0];

  return (
    <article className="feature reveal" data-reveal>
      <Link
        to={`/projetos/${run.slug}`}
        className="feature-link"
        aria-label={`${run.title} — abrir o caso completo`}
      >
        <p className="feature-meta">
          <span className="feature-index num">{String(index + 1).padStart(2, "0")}</span>
          <span className="feature-tag">{run.meta}</span>
          <span className="feature-year num">{run.year}</span>
        </p>
        <div className="feature-frame">
          <img
            src={poster}
            alt={`Capa do projeto ${run.title}`}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="feature-foot">
          <div>
            <h3 className="feature-title">{run.title}</h3>
            <p className="feature-note">{run.note}</p>
          </div>
          <span className="feature-go" aria-hidden="true">
            Ver o caso
            <span className="feature-go-arrow">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
};

/**
 * Em destaque — os três cases.
 * Minimalista, fólio de impressão: índice, linha, capa, rodapé.
 */
const Work = () => {
  const featured = SHEET_RUNS.filter((run) =>
    ["kamikaze-bot", "importflow", "startanewday"].includes(run.slug)
  );

  return (
    <section id="work" className="work-band">
      <div className="page">
        <p className="band-kicker"><span className="num">04</span>Cases em destaque</p>
        <div className="band-head reveal">
          <h2>Em destaque</h2>
          <p>
            Os três que eu levaria para uma entrevista — todos em produção,
            com código e números.
          </p>
        </div>

        <div className="feature-list">
          {featured.map((run, index) => (
            <WorkCase key={run.slug} run={run} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
