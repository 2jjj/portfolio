import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { SHEET_RUNS } from "@/lib/sheet";

const MAIN = [
  "kamikaze-bot",
  "importflow",
  "startanewday",
  "arquivo-pokemon",
  "fintrack",
  "detoxdigital",
  "goprices",
  "badgesplus",
  "reconkit",
  "prism",
  "cron-help",
  "gofetch",
  "gastos-crud-spring-http-docker",
  "pomodoro-foco",
  "treino-seguro-60",
];

const runs = MAIN.map((slug) => SHEET_RUNS.find((run) => run.slug === slug)).filter(
  (run): run is (typeof SHEET_RUNS)[number] => Boolean(run)
);

/**
 * Trabalhos — indice de todos os projetos.
 * Lista a esquerda, capa flutuante a direita que troca com crossfade.
 * A capa so aparece enquanto a banda esta em cena; fora dela, sai de cena.
 */
const Projects = () => {
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLElement | null>(null);
  const activeRef = useRef(0);

  // Preload das capas: troca acontece sem flash e sem decodificar na hora.
  useEffect(() => {
    runs.forEach((run) => {
      const img = new Image();
      img.decoding = "async";
      img.src = run.frames[0];
    });
  }, []);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const frame = stickyRef.current;
      if (!section || !frame) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // Capa viva apenas enquanto a banda respira na tela.
      const inView = rect.top < vh * 0.82 && rect.bottom > vh * 0.22;
      setLive((current) => (current === inView ? current : inView));

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduced) {
        const delta = (rect.top + rect.height / 2 - vh / 2) / vh;
        frame.style.setProperty("--py", `${Math.max(-30, Math.min(30, -delta * 42)).toFixed(1)}px`);
      }

      if (rect.bottom < 0 || rect.top > vh) return;

      const rows = section.querySelectorAll<HTMLElement>(".idx-row");
      const anchor = vh * 0.45;
      let nearest = activeRef.current;
      let best = Infinity;
      rows.forEach((row, index) => {
        const r = row.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const dist = Math.abs(r.top + r.height / 2 - anchor);
        if (dist < best) {
          best = dist;
          nearest = index;
        }
      });
      if (best < Infinity && nearest !== activeRef.current) setActive(nearest);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const spot = (event: React.PointerEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    section.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    section.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <section
      id="projects"
      className="band band-alt idx-band"
      ref={sectionRef}
      onPointerMove={spot}
    >
      <div className="page">
        <p className="band-kicker"><span className="num">03</span>Trabalhos</p>
        <div className="band-head reveal">
          <h2>Trabalhos</h2>
          <p>
            Quinze projetos principais — de produto vendido a ferramenta de bug
            bounty. Nenhum rascunho: todos rodaram de verdade.
          </p>
        </div>

        <div className="idx-split">
          <div className="idx-list" role="list">
          {runs.map((run, i) => (
            <Link
              key={run.slug}
              to={`/projetos/${run.slug}`}
              className={`idx-row ${active === i ? "is-active" : ""}`}
              role="listitem"
              data-reveal
              style={{ "--reveal-delay": `${i * 55}ms` } as CSSProperties}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
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

          <aside
            ref={stickyRef}
            className={`idx-sticky ${live ? "is-live" : ""}`}
            aria-hidden="true"
          >
            <div className="idx-sticky-frame">
              {runs.map((run, i) => (
                <figure
                  key={run.slug}
                  className={`idx-preview-card ${active === i ? "is-active" : ""}`}
                  aria-hidden="true"
                >
                  <img
                    src={run.frames[0]}
                    alt=""
                    loading={i < 3 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                  <figcaption>
                    <span>{run.title}</span>
                    <span>{run.meta}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Projects;
