import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SHEET_RUNS } from "@/lib/sheet";

/**
 * Trabalhos — indice de todos os projetos.
 * Linhas grandes, numero a esquerda, preview seguindo o cursor.
 * Os tres cases ficam em "Em destaque"; aqui a lista e completa.
 */
const Projects = () => {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = previewRef.current;
    const sec = sectionRef.current;
    if (!el || !sec) return;
    const r = sec.getBoundingClientRect();
    el.style.transform = `translate3d(${e.clientX - r.left - 150}px, ${
      e.clientY - r.top - 96
    }px, 0)`;
  };

  const preview = active !== null ? SHEET_RUNS[active] : null;

  return (
    <section
      id="projects"
      className="band band-alt idx-band"
      ref={sectionRef}
      onPointerMove={onMove}
    >
      <div className="page">
        <div className="band-head reveal visible">
          <h2>Trabalhos</h2>
          <p>
            Nove projetos publicados. Nenhum deles e rascunho: todos rodaram de
            verdade.
          </p>
        </div>

        <div className="idx-list" role="list">
          {SHEET_RUNS.map((run, i) => (
            <Link
              key={run.slug}
              to={`/projetos/${run.slug}`}
              className={`idx-row ${active === i ? "is-active" : ""}`}
              role="listitem"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <span className="idx-num num">{String(i + 1).padStart(2, "0")}</span>
              <span className="idx-title">{run.title}</span>
              <span className="idx-meta">{run.meta}</span>
              <span className="idx-year num">{run.year}</span>
              <span className="idx-go" aria-hidden="true">
                &#8599;
              </span>
            </Link>
          ))}
        </div>

        <div
          className={`idx-preview ${preview ? "is-on" : ""}`}
          ref={previewRef}
          aria-hidden="true"
        >
          {preview && <img src={preview.frames[0]} alt="" loading="lazy" />}
        </div>
      </div>
    </section>
  );
};

export default Projects;
