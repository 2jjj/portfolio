import { Link } from "react-router-dom";
import { SHEET_RUNS } from "@/lib/sheet";

/**
 * Em destaque — os tres cases.
 * Capa grande em sangria, duas telas de apoio, dados embaixo.
 * Sem frame repetido: cada bloco mostra uma vez o que o projeto tem.
 */
const Work = () => {
  const featured = SHEET_RUNS.filter((run) =>
    ["kamikaze-bot", "importflow", "startanewday"].includes(run.slug)
  );

  return (
    <section className="work-band">
      <div className="page">
        <div className="band-head reveal visible">
          <h2>Em destaque</h2>
          <p>
            Os três que eu levaria para uma entrevista — todos em produção, com
            código e números.
          </p>
        </div>

        {featured.map((run, index) => {
          const unique = [...new Set(run.frames)];
          const poster = unique[0];
          const stills = unique.slice(1);

          return (
            <article className="work-run reveal" key={run.slug}>
              <Link
                to={`/projetos/${run.slug}`}
                className="work-card"
                aria-label={`${run.title} — abrir o caso completo`}
              >
                <div className="work-head">
                  <span className="work-index num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="work-tag">{run.meta}</span>
                  <span className="work-year num">{run.year}</span>
                </div>

                <div className="work-cover">
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
        })}
      </div>
    </section>
  );
};

export default Work;
