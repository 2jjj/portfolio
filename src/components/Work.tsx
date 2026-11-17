import { useRef } from "react";
import { Link } from "react-router-dom";
import { SHEET_RUNS, type SheetRun } from "@/lib/sheet";
import { useTilt } from "@/lib/use-motion";

type Props = { run: SheetRun; index: number };

/** Um case: capa com inclinacao 3D, dados e duas telas de apoio. */
const WorkCase = ({ run, index }: Props) => {
  const coverRef = useRef<HTMLDivElement | null>(null);
  useTilt(coverRef, 5);

  const unique = [...new Set(run.frames)];
  const poster = unique[0];
  const stills = unique.slice(1);

  return (
    <article className="work-run reveal">
      <Link
        to={`/projetos/${run.slug}`}
        className="work-card"
        aria-label={`${run.title} — abrir o caso completo`}
      >
        <div className="work-head">
          <span className="work-index num">{String(index + 1).padStart(2, "0")}</span>
          <span className="work-tag">{run.meta}</span>
          <span className="work-year num">{run.year}</span>
        </div>

        <div className="work-cover" ref={coverRef}>
          {run.video ? (
            <video
              src={run.video}
              poster={poster}
              controls
              preload="none"
              playsInline
              muted
              loop
              aria-label={`Demonstração de ${run.title}`}
            />
          ) : (
            <img src={poster} alt={`Capa de ${run.title}`} loading="lazy" />
          )}
          <span className="work-cover-sheen" aria-hidden="true" />
        </div>

        <div className="work-body">
          <h3 className="work-title">{run.title}</h3>
          <p className="work-desc">{run.note}</p>
          <span className="work-go" aria-hidden="true">
            Ver o caso completo &#8594;
          </span>
        </div>

        {stills.length > 0 && (
          <div className="work-stills">
            {stills.slice(0, 2).map((src) => (
              <div className="work-shot" key={src}>
                <img src={src} alt={`Captura de ${run.title}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
};

/**
 * Em destaque — os tres cases.
 * Capa grande em sangria, duas telas de apoio, dados embaixo.
 */
const Work = () => {
  const featured = SHEET_RUNS.filter((run) =>
    ["kamikaze-bot", "importflow", "startanewday"].includes(run.slug)
  );

  return (
    <section className="work-band">
      <div className="page">
        <div className="band-head reveal">
          <h2>Em destaque</h2>
          <p>
            Os três que eu levaria para uma entrevista — todos em produção, com
            código e números.
          </p>
        </div>

        {featured.map((run, index) => (
          <WorkCase run={run} index={index} key={run.slug} />
        ))}
      </div>
    </section>
  );
};

export default Work;
