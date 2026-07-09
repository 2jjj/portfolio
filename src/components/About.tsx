import { useEffect, useRef, useState } from "react";
import { Code2, Rocket, Target } from "lucide-react";
import { api } from "@/lib/api";

const About = () => {
  const [aboutText, setAboutText] = useState("");
  const [aboutSecondary, setAboutSecondary] = useState("");
  const [stats, setStats] = useState({ years: 0, projects: 0, dedication: 0 });
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ years: 0, projects: 0, dedication: 0 });

  useEffect(() => {
    Promise.all([api.about.get(), api.site.get()])
      .then(([about, site]) => {
        setAboutText(about.about_text || "");
        setAboutSecondary(about.about_secondary || "");
        const target = {
          years: Number(site.stats_years) || 0,
          projects: Number(site.stats_projects) || 0,
          dedication: Number(site.stats_dedication) || 0,
        };
        targetRef.current = target;
        setStats(target);
      })
      .catch((err) => {
        console.error(err);
        const fallback = { years: 5, projects: 10, dedication: 100 };
        targetRef.current = fallback;
        setStats(fallback);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const start = performance.now();
            const duration = 1600;
            const target = targetRef.current;

            const animate = (time: number) => {
              const progress = Math.min((time - start) / duration, 1);
              setStats({
                years: Math.floor(progress * target.years),
                projects: Math.floor(progress * target.projects),
                dedication: Math.floor(progress * target.dedication),
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
        {loading ? (
          <p className="section-copy">Carregando...</p>
        ) : (
          <>
            <p className="section-copy reveal" style={{ animationDelay: "0.1s" }}>
              {aboutText}
            </p>
            <div className="about-grid">
              <div className="about-text">
                <p className="section-copy reveal" style={{ animationDelay: "0.2s" }}>
                  {aboutSecondary}
                </p>
              </div>
              <div className="stats-grid">
                <div className="stats-card reveal" style={{ animationDelay: "0.35s" }}>
                  <div className="stats-icon">
                    <Code2 size={20} />
                  </div>
                  <div>
                    <div className="stats-value">{stats.years}+</div>
                    <div className="stats-label">Anos de Experiência</div>
                  </div>
                </div>
                <div className="stats-card reveal" style={{ animationDelay: "0.4s" }}>
                  <div className="stats-icon">
                    <Rocket size={20} />
                  </div>
                  <div>
                    <div className="stats-value">{stats.projects}+</div>
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
          </>
        )}
      </div>
    </section>
  );
};

export default About;
