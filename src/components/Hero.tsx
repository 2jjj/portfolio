import { useEffect, useState, type MouseEvent } from "react";
import { ArrowDown, FileText, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteInfo } from "@/hooks/use-public-api";
import { scrollToHash } from "@/lib/scroll";
import ConstellationCanvas from "@/components/ConstellationCanvas";

const DEFAULT_PHRASES = [
  "Full Stack Developer",
  "React & Node.js",
  "Sites, bots e APIs",
  "Java & Spring Boot",
];

const Hero = () => {
  const [description, setDescription] = useState(
    "Desenvolvedor full stack em RibeirÃ£o Preto. FaÃ§o site de uma pÃ¡gina, bot de WhatsApp, automaÃ§Ã£o e API com Pix â€” preÃ§o fechado, entrega em dias. Aberto a freela e a vaga jÃºnior."
  );
  const [phrases, setPhrases] = useState(DEFAULT_PHRASES);

  const { data: siteData } = useSiteInfo();

  useEffect(() => {
    if (siteData) {
      if (siteData.hero_description) setDescription(siteData.hero_description);
      if (Array.isArray(siteData.hero_phrases) && siteData.hero_phrases.length > 0) {
        setPhrases(siteData.hero_phrases);
      }
    }
  }, [siteData]);

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (scrollToHash(href)) {
      event.preventDefault();
    }
  };

  const githubUrl = siteData?.github_url || "https://github.com/2jjj";
  const linkedinUrl = siteData?.linkedin_url || "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/";
  const email = siteData?.public_email || "pedrosakamoto27@gmail.com";
  const availability = siteData?.availability || "Disponibilidade imediata";
  const location = siteData?.location || "RibeirÃ£o Preto, SP";

  return (
    <section id="home" className="hero-section">
      <ConstellationCanvas />
      <div className="hero-gradient-mesh" />
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-greeting">OlÃ¡, eu sou</div>
          <h1 className="hero-title">
            <span className="hero-line-mask">
              <span className="hero-line">Pedro</span>
            </span>
            <span className="hero-line-mask">
              <span className="hero-line hero-line-accent">Sakamoto</span>
            </span>
          </h1>
          <h2 className="hero-subtitle">
            <span className="typewriter">{phrases[0]}</span>
          </h2>
          <div className="hero-availability">
            <span className="hero-availability-dot" aria-hidden="true" />
            <span>{availability}</span>
            <span className="hero-availability-sep" aria-hidden="true">Â·</span>
            <span>{location}</span>
          </div>
          <p className="hero-description">{description}</p>

          <div className="hero-actions">
            <a
              href="#projects"
              className="btn btn-primary slot-btn"
              onClick={(event) => handleAnchor(event, "#projects")}
            >
              <span className="slot-btn-text">Ver Projetos</span>
              <span className="slot-btn-hover">Ver Projetos</span>
            </a>
            <Link to="/curriculo" className="btn btn-outline">
              <FileText size={16} /> CurrÃ­culo
            </Link>
            <a
              href="#contact"
              className="btn btn-outline slot-btn"
              onClick={(event) => handleAnchor(event, "#contact")}
            >
              <span className="slot-btn-text">Contato</span>
              <span className="slot-btn-hover">Contato</span>
            </a>
          </div>

          <div className="social-links">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${email}`} className="social-link" aria-label="E-mail">
              <Mail size={18} />
            </a>
          </div>

          <dl className="hero-metrics">
            <div>
              <dt>Em produÃ§Ã£o</dt>
              <dd>3</dd>
            </div>
            <div>
              <dt>Produtos no catÃ¡logo</dt>
              <dd>219</dd>
            </div>
            <div>
              <dt>Testes automatizados</dt>
              <dd>63</dd>
            </div>
          </dl>
        </div>

      </div>

      <a
        href="#about"
        className="hero-scroll-down"
        aria-label="Ir para a seÃ§Ã£o sobre"
        onClick={(event) => handleAnchor(event, "#about")}
      >
        <ArrowDown size={20} />
      </a>
    </section>
  );
};

export default Hero;
