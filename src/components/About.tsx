import { useEffect, useRef, useState } from "react";
import { Calendar, Code, Database } from "lucide-react";
import { useAbout, useSiteInfo } from "@/hooks/use-public-api";

const About = () => {
  const { data: aboutData } = useAbout();
  const { data: siteData } = useSiteInfo();
  const [counters, setCounters] = useState({ years: 0, projects: 0, tech: 0 });
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const statsYears = Number(siteData?.stats_years) || 4;
  const statsProjects = Number(siteData?.stats_projects) || 10;
  const statsTech = Array.isArray(siteData?.skills) ? siteData.skills.length : 8;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
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
        tech: Math.min(Math.round(statsTech * progress), statsTech),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [started, statsYears, statsProjects, statsTech]);

  return (
    <section id="about" className="section">
      <div className={`section-inner ${visible ? "visible" : ""}`} ref={sectionRef}>
        <div className="section-label">Sobre</div>
        <h2 className="section-title reveal marker-fill">
          Quem <span>sou</span>
        </h2>
        <div className="about-text-grid reveal">
          <p className="section-copy">
            {aboutData.about_text}
          </p>
          {aboutData.about_secondary && (
            <p className="section-copy">
              {aboutData.about_secondary}
            </p>
          )}
        </div>

        <div className="stats-row reveal">
          <div className="stat-item">
            <div className="stat-icon"><Calendar size={20} /></div>
            <div className="stat-value">{counters.years}+</div>
            <div className="stat-label">Anos de experiência</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><Code size={20} /></div>
            <div className="stat-value">{counters.projects}+</div>
            <div className="stat-label">Projetos entregues</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><Database size={20} /></div>
            <div className="stat-value">{counters.tech}</div>
            <div className="stat-label">Tecnologias no stack</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

