import { useEffect, useState } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import profilePic from "@/assets/profile.jpeg";
import { api } from "@/lib/api";

const DEFAULT_PHRASES = [
  "Full Stack Developer",
  "Banco de Dados",
  "React",
  "JavaScript",
  "Node.js",
  "APIs",
];

const Hero = () => {
  const [typedText, setTypedText] = useState(() => DEFAULT_PHRASES[0][0] || "");
  const [description, setDescription] = useState("Desenvolvedor front-end com base solida em React e bancos de dados. Experiencia pratica em back-end construindo bots para Discord, hoje aprofundando em Node.js, Go, Docker e Java Spring.");
  const [phrases, setPhrases] = useState(DEFAULT_PHRASES);

  useEffect(() => {
    api.site.get().then((data) => {
      if (data.hero_description) setDescription(data.hero_description);
      if (Array.isArray(data.hero_phrases) && data.hero_phrases.length > 0) {
        setPhrases(data.hero_phrases);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (phrases.length === 0) return;
    let phraseIndex = 0;
    let charIndex = 1;
    let isDeleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const type = () => {
      const current = phrases[phraseIndex] || "";

      if (!isDeleting) {
        setTypedText(current.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          timer = setTimeout(type, 2000);
          return;
        }
        timer = setTimeout(type, 60);
      } else {
        setTypedText(current.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          const next = phrases[phraseIndex] || "";
          charIndex = 1;
          setTypedText(next[0] || "");
          timer = setTimeout(type, 400);
          return;
        }
        timer = setTimeout(type, 30);
      }
    };

    timer = setTimeout(type, 0);

    return () => clearTimeout(timer);
  }, [phrases]);

  return (
    <section id="home" className="hero-section">
      <div className="hero-gradient-mesh" />
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-greeting">Ola, eu sou</div>
          <h1 className="hero-title">Pedro Sakamoto</h1>
          <h2 className="hero-subtitle">
            <span className="typewriter">{typedText}</span>
          </h2>
          <p className="hero-description">{description}</p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              Ver Projetos
            </a>
            <a href="#contact" className="btn btn-outline">
              Contato
            </a>
          </div>

          <div className="social-links">
            <a href="https://github.com/2jjj" target="_blank" rel="noopener noreferrer" className="social-link">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/" target="_blank" rel="noopener noreferrer" className="social-link">
              <Linkedin size={18} />
            </a>
            <a href="mailto:pedrosakamoto27@gmail.com" className="social-link">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="hero-photo-wrapper">
          <div className="hero-photo-ring" />
          <img src={profilePic} alt="Pedro Sakamoto" className="hero-photo" loading="lazy" />
        </div>
      </div>

      <a href="#about" className="hero-scroll-down">
        <ArrowDown size={20} />
      </a>
    </section>
  );
};

export default Hero;
