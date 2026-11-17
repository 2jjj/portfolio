import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSiteInfo } from "@/hooks/use-public-api";
import { FRAMES } from "@/lib/frames";

/**
 * Hero — "Ring of frames around the headline".
 * 24 quadros reais em volta do nucleo; apontar/focar um escurece os
 * outros e troca a frase de apoio pelo nome do projeto.
 */

const RING_COUNT = 18;

type Placed = {
  src: string;
  alt: string;
  left: number;
  top: number;
  w: number;
  h: number;
  rot: number;
  project: string;
  year: string;
};

/** Coloca os quadros na elipse (rx 560 / ry 310) e cresce em direcao a camera. */
function layout(): Placed[] {
  const vw = typeof window === "undefined" ? 1440 : window.innerWidth;
  const mobile = vw < 860;

  const cx = 50;
  const cy = 50;
  // em % do hero
  const rx = mobile ? 78 : 46;
  const ry = mobile ? 40 : 40;

  const n = mobile ? 12 : RING_COUNT;
  const picks = FRAMES.slice(0, n);

  return picks.map((frame, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    // quadros de baixo sao maiores: o anel parece inclinado
    const depth = (Math.sin(angle) + 1) / 2; // 0 topo -> 1 base
    const base = mobile ? 74 : 100;
    const w = base + depth * (mobile ? 16 : 52);
    const ratio = frame.w / frame.h;
    const h = w / ratio;
    // tangente da elipse
    const deg = (Math.atan2(-ry * Math.cos(angle), -rx * Math.sin(angle)) * 180) / Math.PI;
    const rot = Math.max(-30, Math.min(30, deg * 0.5));

    return {
      src: frame.src,
      alt: frame.alt,
      left: x,
      top: y,
      w,
      h,
      rot,
      project: frame.project,
      year: frame.year,
    };
  });
}

const Hero = () => {
  const { data: siteData } = useSiteInfo();
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [frames, setFrames] = useState<Placed[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const apply = () => setFrames(layout());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const description = useMemo(() => {
    const fallback =
      "Site de uma página, bot de WhatsApp, automação e API com Pix. Preço fechado, entrega em dias, pagamento no Pix.";
    return siteData?.hero_description || fallback;
  }, [siteData]);

  const availability = siteData?.availability || "Disponibilidade imediata";
  const location = siteData?.location || "Ribeirão Preto, SP";

  const onEnter = (index: number) => {
    setActive(index);
    const frame = frames[index];
    if (frame) setHint(`${frame.project} · ${frame.year}`);
  };

  const onLeave = () => {
    setActive(null);
    setHint(null);
  };

  return (
    <section className="hero" id="home">
      <div
        className={`hero-ring ${active !== null ? "has-focus" : ""}`}
        ref={ringRef}
        aria-hidden="true"
      >
        {frames.map((frame, index) => (
          <a
            key={`${frame.src}-${index}`}
            className={`hero-frame ${active === index ? "is-active" : ""}`}
            href="#projects"
            tabIndex={-1}
            style={{
              left: `${frame.left}%`,
              top: `${frame.top}%`,
              width: `${frame.w}px`,
              height: `${frame.h}px`,
              transform: `translate(-50%, -50%) rotate(${frame.rot}deg)`,
              zIndex: active === index ? 4 : 2,
            }}
            onMouseEnter={() => onEnter(index)}
            onMouseLeave={onLeave}
            onFocus={() => onEnter(index)}
            onBlur={onLeave}
          >
            <img src={frame.src} alt="" loading={index < 6 ? "eager" : "lazy"} decoding="async" />
          </a>
        ))}
      </div>

      <div className="hero-core">
        <h1 className="hero-title">
          <span>
            <b>Desenvolvedor</b>
          </span>
          <span>
            <b>full stack</b>
          </span>
        </h1>

        <p className="hero-sub">
          {hint ? (
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{hint}</strong>
          ) : (
            <>
              {location} · {description}
            </>
          )}
        </p>

        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary">
            Ver trabalhos
          </a>
          <Link to="/curriculo" className="btn btn-ghost" style={{ marginLeft: 10 }}>
            Currículo
          </Link>
        </div>
      </div>

      <div className="hero-strip">
        <dl style={{ gridColumn: "span 3" }}>
          <dt>Atua</dt>
          <dd>
            Desenvolvedor full stack
            <br />
            Freelancer
          </dd>
        </dl>
        <dl style={{ gridColumn: "span 3" }}>
          <dt>Base</dt>
          <dd>
            Ribeirão Preto, SP
            <br />
            Remoto em todo o Brasil
          </dd>
        </dl>
        <dl style={{ gridColumn: "span 3" }}>
          <dt>Estuda</dt>
          <dd>
            Engenharia da Computação
            <br />
            Unaerp · turma da manhã
          </dd>
        </dl>
        <dl style={{ gridColumn: "span 3" }}>
          <dt>Alcance</dt>
          <dd>
            <a href="#contact">{availability}</a>
            <br />
            <a href="mailto:pedrosakamoto27@gmail.com">pedrosakamoto27@gmail.com</a>
          </dd>
        </dl>
      </div>
    </section>
  );
};

export default Hero;
