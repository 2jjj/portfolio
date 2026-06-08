import { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import profilePic from "@/assets/profile.jpeg";

const Hero = () => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const phrase = "Back-End Developer";
    let i = 0;
    
    const timer = window.setInterval(() => {
      if (i < phrase.length) {
        setTypedText(phrase.substring(0, i + 1));
        i += 1;
      } else {
        window.clearInterval(timer);
      }
    }, 80);

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, []);

  return (
    <section id="home" className="hero-section reveal">
      <div className="hero-grid">
        <div className="hero-photo-wrapper reveal" style={{ animationDelay: "0.15s" }}>
          <img src={profilePic} alt="Pedro Sakamoto" className="hero-photo" loading="lazy" />
        </div>

        <div>
          <p className="hero-badge reveal" style={{ animationDelay: "0.2s" }}>
            <span className="hero-badge-dot" /> Disponível para trabalho
          </p>
          <h1 className="hero-title reveal" style={{ animationDelay: "0.3s" }}>
            Pedro Sakamoto
          </h1>
          <h2 className="hero-subtitle reveal" style={{ animationDelay: "0.35s" }}>
            <span className="typewriter">{typedText}</span>
          </h2>
          <p className="hero-description reveal" style={{ animationDelay: "0.4s" }}>
            Desenvolvedor back-end com foco em APIs, bancos de dados e sistemas escaláveis. Crio servidores robustos e integrações prontas para produção.
          </p>

          <div className="hero-actions reveal" style={{ animationDelay: "0.5s" }}>
            <a href="#projects" className="btn btn-primary" data-hover>
              Ver Projetos
            </a>
            <a href="#contact" className="btn btn-outline" data-hover>
              Contato
            </a>
          </div>

          <div className="social-links reveal" style={{ animationDelay: "0.6s" }}>
            <a href="https://github.com/2jjj" target="_blank" rel="noopener noreferrer" className="social-link" data-hover>
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/" target="_blank" rel="noopener noreferrer" className="social-link" data-hover>
              <Linkedin size={18} />
            </a>
            <a href="mailto:pedrosakamoto27@gmail.com" className="social-link" data-hover>
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;