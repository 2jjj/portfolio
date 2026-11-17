import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { SHEET_RUNS, type SheetRun } from "@/lib/sheet";

type Props = { run: SheetRun; index: number };

/** Case pequeno em grade harmonica de seis colunas. */
const Tile = ({ run, index }: Props) => {
  return (
    <Link
      to={`/projetos/${run.slug}`}
      className="tile"
      data-reveal
      style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
      aria-label={`${run.title} — abrir o caso completo`}
    >
      <span className="tile-index num">{String(index + 1).padStart(2, "0")}</span>
      <div className="tile-frame">
        <img
          src={run.frames[0]}
          alt={`Capa de ${run.title}`}
          loading="lazy"
          decoding="async"
        />
      </div>
      <p className="tile-meta">
        <span className="tile-name">{run.title}</span>
        <span className="tile-tag">{run.meta}</span>
      </p>
    </Link>
  );
};

const SIX: string[] = [
  "kamikaze-bot",
  "importflow",
  "startanewday",
  "fintrack",
  "goprices",
  "reconkit",
];

/**
 * Em destaque — seis cases em grade armonica, do tamanho que o portfolio
 * merece: pequenos o bastante para harmonia, grandes o bastante para chamar.
 */
const Work = () => {
  const featured = SIX.map((slug) => SHEET_RUNS.find((run) => run.slug === slug)!).filter(Boolean);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      document.querySelectorAll<HTMLElement>(".tile-frame img").forEach((img) => {
        const rect = img.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const delta = (center - window.innerHeight / 2) / window.innerHeight;
        img.style.setProperty("--py", `${Math.max(-12, Math.min(12, -delta * 16)).toFixed(1)}px`);
      });
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

  return (
    <section id="work" className="work-band">
      <div className="page">
        <p className="band-kicker"><span className="num">04</span>Cases em destaque</p>
        <div className="band-head reveal">
          <h2>Em destaque</h2>
          <p>
            Os seis que eu levaria para uma entrevista — SaaS, bot vendido
            para a Kamikaze, controle financeiro e um CLI de recon para bug
            bounty. Todos em produção, com código e números.
          </p>
        </div>

        <div className="bento">
          {featured.map((run, index) => (
            <Tile key={run.slug} run={run} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
