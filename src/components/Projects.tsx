import { useState } from "react";
import { Link } from "react-router-dom";
import { SHEET_RUNS } from "@/lib/sheet";

/**
 * Trabalhos — "The contact sheet".
 * Cada projeto e uma corrida de quadros em ordem, texto todo no mesmo
 * tamanho pequeno. Passar o mouse numa corrida escurece as outras e
 * troca a linha de nota pelo texto daquele projeto.
 */
const Projects = () => {
  const [active, setActive] = useState<string | null>(null);
  const current = SHEET_RUNS.find((run) => run.slug === active) || null;

  return (
    <section id="projects" className="band band-alt">
      <div className="page">
        <div className="band-head reveal visible">
          <h2>Trabalhos</h2>
          <p>Nove projetos publicados. Nenhum deles e rascunho: todos rodaram de verdade.</p>
        </div>

        <div className="sheet" role="list">
          {SHEET_RUNS.map((run) => (
            <div key={run.slug} role="listitem" className="sheet-run-block">
              <div className="sheet-head">
                <strong>{run.title}</strong>
                <span>
                  {run.meta} · <span className="num">{run.year}</span>
                </span>
              </div>

              <div className={`sheet-run ${active && active !== run.slug ? "sheet-dim" : ""}`}>
                {run.frames.map((frame, index) => (
                  <Link
                    key={`${run.slug}-${index}`}
                    to={`/projetos/${run.slug}`}
                    className={`sheet-item ${active === run.slug ? "is-active" : ""}`}
                    onMouseEnter={() => setActive(run.slug)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(run.slug)}
                    onBlur={() => setActive(null)}
                    aria-label={`${run.title} — abrir projeto`}
                    style={{ flex: "1 1 180px", minWidth: 0 }}
                  >
                    <img src={frame} alt="" loading="lazy" decoding="async" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sheet-note" aria-live="polite">
          {current ? current.note : "Passe o mouse por uma tira para ver o que o projeto faz."}
        </div>
      </div>
    </section>
  );
};

export default Projects;
