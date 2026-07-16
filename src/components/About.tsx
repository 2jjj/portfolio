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
        const fallback = { years: 3, projects: 5, dedication: 100 };
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
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const statItems = [
    { icon: Code2, value: stats.years, suffix: "+", label: "Anos de Experiencia" },
    { icon: Rocket, value: stats.projects, suffix: "+", label: "Projetos Completos" },
    { icon: Target, value: stats.dedication, suffix: "%", label: "Dedicacao" },
  ];

  return (
    <section id="about" className="section">
      <div className="section-inner" ref={sectionRef}>
        <div className="section-label">Sobre Mim</div>
        <h2 className="section-title">
          Quem <span>sou eu</span>
        </h2>

        {loading ? (
          <p className="section-copy">Carregando...</p>
        ) : (
          <>
            <p className="section-copy">
              {aboutText}
            </p>
            <p className="section-copy">
              {aboutSecondary}
            </p>

            <div className="stats-row">
              {statItems.map((item, index) => (
                <div
                  key={item.label}
                  className="stat-item"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="stat-icon">
                    <item.icon size={20} />
                  </div>
                  <div className="stat-value">
                    {item.value}{item.suffix}
                  </div>
                  <div className="stat-label">{item.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default About;
