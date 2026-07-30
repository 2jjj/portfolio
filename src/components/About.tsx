import { useEffect, useRef, useState } from "react";
import { useAbout, useSiteInfo } from "@/hooks/use-public-api";

const About = () => {
  const { data: aboutData } = useAbout();
  const { data: siteData } = useSiteInfo();
  const [counters, setCounters] = useState({ years: 0, projects: 0, dedication: 0 });
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const statsYears = Number(siteData?.stats_years) || 3;
  const statsProjects = Number(siteData?.stats_projects) || 5;
  const statsDedication = Number(siteData?.stats_dedication) || 100;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1500;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        years: Math.min(Math.round(statsYears * progress), statsYears),
        projects: Math.min(Math.round(statsProjects * progress), statsProjects),
        dedication: Math.min(Math.round(statsDedication * progress), statsDedication),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [started, statsYears, statsProjects, statsDedication]);

  return (
    <section id="about" className="section">
      <div className="section-inner" ref={sectionRef}>
        <div className="section-label">Sobre</div>
        <h2 className="section-title">
          Quem <span>sou</span>
        </h2>
        <p className="section-copy about-text">
          {aboutData?.about_text || "Carregando..."}
        </p>
        {aboutData?.about_secondary && (
          <p className="section-copy about-text-secondary">
            {aboutData.about_secondary}
          </p>
        )}

        <div className="about-stats">
          <div className="about-stat">
            <div className="about-stat-number">{counters.years}+</div>
            <div className="about-stat-label">Anos de experiencia</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-number">{counters.projects}+</div>
            <div className="about-stat-label">Projetos realizados</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-number">{counters.dedication}%</div>
            <div className="about-stat-label">Dedicacao</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
