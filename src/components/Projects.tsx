import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { SHEET_RUNS } from "@/lib/sheet";

/**
 * Trabalhos — indice de todos os projetos.
 * Lista a esquerda, um case do lado direito que troca ao focar/passar o mouse.
 */
const Projects = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const section = sectionRef.current;
      const card = section?.querySelector<HTMLElement>(".idx-preview-card");
      if (section && card) {
        const rect = card.getBoundingClientRect();
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          const center = rect.top + rect.height / 2;
          const delta = (center - window.innerHeight / 2) / window.innerHeight;
          card.style.setProperty("--py", `${Math.max(-18, Math.min(18, -delta * 32)).toFixed(1)}px`);
        }
      }
      raf = 0;
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
    "gastos-crud-spring",
    "pomodoro-foco",
    "treino-seguro-60",
  ];
  const runs = MAIN.map((slug) => SHEET_RUNS.find((run) => run.slug === slug)!).filter(Boolean);
  const preview = runs[active] ?? runs[0];

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

          <aside className="idx-sticky" aria-hidden="true">
            <div className="idx-sticky-frame">
              <figure className="idx-preview-card" key={preview.slug}>
                <img src={preview.frames[0]} alt="" loading="lazy" />
                <figcaption>
                  <span>{preview.title}</span>
                  <span>{preview.meta}</span>
                </figcaption>
              </figure>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Projects;
