import { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import profilePic from "@/assets/profile.jpeg";
import { api } from "@/lib/api";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const phrases = [
      "Full Stack Developer",
      "Banco de Dados",
      "React",
      "JavaScript",
      "Node.js",
      "APIs",
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer: number;

    const type = () => {
      const current = phrases[phraseIndex];

      if (!isDeleting) {
        setTypedText(current.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          timer = window.setTimeout(type, 2000);
          return;
        }
        timer = window.setTimeout(type, 60);
      } else {
        setTypedText(current.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timer = window.setTimeout(type, 400);
          return;
        }
        timer = window.setTimeout(type, 30);
      }
    };

    timer = window.setTimeout(type, 500);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    api.site.get().then((data) => {
      if (data.hero_description) setDescription(data.hero_description);
    }).catch(() => {});
  }, []);

  return (
    <section id="home" className="hero-section reveal">
      <div className="hero-grid">
        <div className="hero-photo-wrapper reveal" style={{ animationDelay: "0.15s" }}>
          <img src={profilePic} alt="Pedro Sakamoto" className="hero-photo" loading="lazy" />
        </div>

        <div>
          <h1 className="hero-title reveal" style={{ animationDelay: "0.3s" }}>
            Pedro Sakamoto
          </h1>
          <h2 className="hero-subtitle reveal" style={{ animationDelay: "0.35s" }}>
            <span className="typewriter">{typedText}</span>
          </h2>
          <p className="hero-description reveal" style={{ animationDelay: "0.4s" }}>
            {description || "Desenvolvedor front-end com base sólida em React e bancos de dados."}
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