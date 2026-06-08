import { useEffect, useRef, useState } from "react";
import { Code2, Rocket, Target } from "lucide-react";

const About = () => {
  const [stats, setStats] = useState({ years: 0, projects: 0, dedication: 0 });
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const start = performance.now();
            const duration = 1600;

            const animate = (time: number) => {
              const progress = Math.min((time - start) / duration, 1);
              setStats({
                years: Math.floor(progress * 4),
                projects: Math.floor(progress * 7),
                dedication: Math.floor(progress * 100),
              });
              if (progress < 1) {
                window.requestAnimationFrame(animate);
              }
            };

            window.requestAnimationFrame(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section">
      <div className="section-inner" ref={sectionRef}>
        <div className="section-label">Sobre Mim</div>
        <h2 className="section-title">
          Sobre <span>Mim</span>
        </h2>
        <p className="section-copy reveal" style={{ animationDelay: "0.1s" }}>
          Desenvolvedor back-end com 4 anos de experiência em construir APIs robustas, sistemas escaláveis e integrações com plataformas externas.
          Comecei aos 13 anos com código e meu primeiro projeto real foi um bot para Discord presente em mais de 1.000 servidores verificados.
        </p>
        <div className="about-grid">
          <div className="about-text">
            <p className="section-copy reveal" style={{ animationDelay: "0.2s" }}>
              Hoje meu foco é back-end: arquitetura de APIs, banco de dados, autenticação e infraestrutura. Tenho noção de front-end suficiente para colaborar em projetos full stack, mas onde realmente entrego valor é no servidor.
            </p>
            <p className="section-copy reveal" style={{ animationDelay: "0.3s" }}>
              Estou aprofundando Docker e containerização para entregar aplicações mais confiáveis, escaláveis e fáceis de manter.
            </p>
          </div>
          <div className="stats-grid">
            <div className="stats-card reveal" style={{ animationDelay: "0.35s" }}>
              <div className="stats-icon">
                <Code2 size={20} />
              </div>
              <div>
                <div className="stats-value">{stats.years >= 4 ? "4+" : `${stats.years}+`}</div>
                <div className="stats-label">Anos de Experiência</div>
              </div>
            </div>
            <div className="stats-card reveal" style={{ animationDelay: "0.4s" }}>
              <div className="stats-icon">
                <Rocket size={20} />
              </div>
              <div>
                <div className="stats-value">{stats.projects >= 7 ? "7+" : `${stats.projects}+`}</div>
                <div className="stats-label">Projetos Completos</div>
              </div>
            </div>
            <div className="stats-card reveal" style={{ animationDelay: "0.45s" }}>
              <div className="stats-icon">
                <Target size={20} />
              </div>
              <div>
                <div className="stats-value">{stats.dedication}%</div>
                <div className="stats-label">Dedicação</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
