import { useSiteInfo } from "@/hooks/use-public-api";
import { scrollToHash } from "@/lib/scroll";
import type { MouseEvent } from "react";

/**
 * Hero minimal: o nome em destaque, uma frase, um contato.
 * Sem WebGL, sem typewriter, sem collage — uma página, um nome, um convite.
 */
const Hero = () => {
  const { data: siteData } = useSiteInfo();

  const availability = siteData?.availability || "Disponível para freela e vaga júnior";
  const location = siteData?.location || "Ribeirão Preto, SP";
  const email = siteData?.public_email || "pedrosakamoto27@gmail.com";
  const description =
    siteData?.hero_description ||
    "Faço site de uma página, bot de WhatsApp, automação e API com Pix. Preço fechado, entrega em dias.";

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (scrollToHash(href)) event.preventDefault();
  };

  return (
    <section id="home" className="hero-minimal" aria-label="Apresentação">
      <div className="hero-minimal-inner">
        <p className="hero-eyebrow">
          Desenvolvedor full stack — {location}
        </p>

        <h1 className="hero-name">Pedro Sakamoto</h1>

        <p className="hero-lede">{description}</p>

        <div className="hero-minimal-cta">
          <a
            href="#projects"
            className="hero-text-link"
            onClick={(event) => handleAnchor(event, "#projects")}
          >
            Ver trabalhos ↓
          </a>
          <a href={`mailto:${email}`} className="hero-text-link hero-text-link-muted">
            ou escreva para mim ↗
          </a>
        </div>
      </div>

      <dl className="hero-strip hero-strip-minimal" aria-hidden="true">
        <div>
          <dt>Atua</dt>
          <dd>Freela · estágio · júnior</dd>
        </div>
        <div>
          <dt>Base</dt>
          <dd>Ribeirão Preto, SP — remoto</dd>
        </div>
        <div>
          <dt>Estuda</dt>
          <dd>Eng. Computação, Unaerp</dd>
        </div>
        <div>
          <dt>Disponibilidade</dt>
          <dd>{availability}</dd>
        </div>
      </dl>
    </section>
  );
};

export default Hero;
