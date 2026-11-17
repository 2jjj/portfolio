import { useSiteInfo } from "@/hooks/use-public-api";
import { scrollToHash } from "@/lib/scroll";
import retrato from "@/assets/profile.jpeg";
import type { MouseEvent } from "react";

/**
 * Hero: duas colunas. Texto à esquerda, retrato emoldurado à direita,
 * faixa de fatos na base. Nome, uma frase, um convite — e a agenda real.
 */
const Hero = () => {
  const { data: siteData } = useSiteInfo();

  const availability = siteData?.availability || "Seg a sex, 13h às 19h · e à noite quando precisa";
  const location = siteData?.location || "Ribeirão Preto, SP";
  const email = siteData?.public_email || "pedrosakamoto27@gmail.com";
  const description =
    siteData?.hero_description ||
    "Sites, e-commerces, bots de WhatsApp, automações e APIs com Pix — do banco à tela, com deploy.";

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (scrollToHash(href)) event.preventDefault();
  };

  return (
    <section id="home" className="hero-minimal" aria-label="Apresentação">
      <div className="hero-grid">
        <div className="hero-minimal-inner">
          <p className="hero-eyebrow">
            Desenvolvedor full stack — {location}
          </p>

          <h1 className="hero-name" aria-label="Pedro Sakamoto">
            <span className="hero-name-word">
              {"Pedro".split("").map((ch, index) => (
                <span
                  key={`p-${index}`}
                  className="hero-ch"
                  aria-hidden="true"
                  style={{ transitionDelay: `${index * 22}ms` }}
                >
                  {ch}
                </span>
              ))}
            </span>{" "}
            <span className="hero-name-word">
              {"Sakamoto".split("").map((ch, index) => (
                <span
                  key={`s-${index}`}
                  className="hero-ch"
                  aria-hidden="true"
                  style={{ transitionDelay: `${(index + 5) * 22}ms` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h1>

          <p className="hero-lede">{description}</p>

          <p className="hero-now">
            <span className="hero-now-dot" aria-hidden="true" />
            agora — turma da manhã na Unaerp · atendo das 13h às 19h e à noite, quando precisa
          </p>

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

        <figure className="hero-portrait">
          <div className="hero-portrait-frame">
            <img
              src={retrato}
              alt="Pedro Sakamoto"
              width={440}
              height={440}
              loading="eager"
              decoding="async"
            />
            <span className="hero-portrait-badge">Engenharia da Computação · Unaerp</span>
          </div>
          <figcaption className="hero-portrait-caption">
            <span className="hero-portrait-name">Pedro Sakamoto</span>
            <span className="hero-portrait-role">Full stack · sites, bots, APIs e SaaS com Pix</span>
            <span className="hero-portrait-available">
              <span className="hero-available-dot" aria-hidden="true" />
              aberto a vaga júnior, estágio e freela
            </span>
          </figcaption>
        </figure>
      </div>

      <dl className="hero-strip hero-strip-minimal" aria-hidden="true">
        <div>
          <dt>Atua</dt>
          <dd>Sites · bots · APIs · SaaS</dd>
        </div>
        <div>
          <dt>Base</dt>
          <dd>Ribeirão Preto, SP — remoto</dd>
        </div>
        <div>
          <dt>Estuda</dt>
          <dd>Eng. da Computação · Unaerp</dd>
        </div>
        <div>
          <dt>Atende</dt>
          <dd>{availability}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>React · Node · Postgres · Go · Java</dd>
        </div>
        <div>
          <dt>Ciber</dt>
          <dd>reconkit · recon p/ bug bounty</dd>
        </div>
      </dl>
    </section>
  );
};

export default Hero;
