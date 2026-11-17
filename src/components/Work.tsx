import { Link } from "react-router-dom";
import { SHEET_RUNS } from "@/lib/sheet";

/**
 * Folha de contato: quadros unicos em grade, sem scroll lateral.
 * Se o projeto tem demonstracao em video, ela abre a folha.
 */
function Strip({ frames, title, video }: { frames: string[]; title: string; video?: string }) {
  const unique = [...new Set(frames)];
  const poster = unique[0];
  const stills = video ? unique.slice(1) : unique;

  return (
    <div className="work-strip" aria-label={`Capturas de ${title}`}>
      {video && (
        <div className="work-shot">
          <video
            src={video}
            poster={poster}
            controls
            preload="none"
            playsInline
            muted
            loop
            aria-label={`Demonstração de ${title}`}
          />
        </div>
      )}

      {stills.map((src) => (
        <div className="work-shot" key={src}>
          <img src={src} alt={`Captura de ${title}`} loading="lazy" />
        </div>
      ))}
    </div>
  );
}

/**
 * Em destaque — a folha de contato dos tres cases.
 * Uma corrida por projeto, com a linha de dados embaixo na grade de 12.
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
          <p>Os três que eu levaria para uma entrevista — todos em produção, com código e números.</p>
        </div>

        {featured.map((run, index) => (
          <article className={`work-run reveal ${index === 0 ? "visible" : ""}`} key={run.slug}>
            <Strip frames={run.frames} title={run.title} video={run.video} />

            <div className="work-facts">
              <div className="work-name">{run.title}</div>
              <div className="work-meta">{run.meta}</div>
              <div className="work-year num">{run.year}</div>
              <div className="work-client">Ver caso completo</div>
            </div>

            <p className="work-desc">{run.note}</p>

            <Link to={`/projetos/${run.slug}`} className="work-link">
              Abrir o caso →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Work;
