import { useEffect, useRef, useState } from "react";
import { Code, GitBranch, Layers, Server, Terminal, Zap, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import type { Skill } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Node: Zap,
  Express: Server,
  React: Code,
  Git: GitBranch,
  Docker: Layers,
  Go: Terminal,
};

function getIcon(title: string): LucideIcon {
  for (const [key, icon] of Object.entries(iconMap)) {
    if (title.includes(key)) return icon;
  }
  return Code;
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    api.skills.get().then(setSkills).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
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
    <section id="skills" className="section">
      <div className="section-inner" ref={sectionRef}>
        <div className="section-label">Skills</div>
        <h2 className="section-title">
          Tecnologias <span>dominio</span>
        </h2>
        <p className="section-copy">
          Ferramentas e tecnologias que utilizo no dia a dia para construir solucoes robustas.
        </p>

        {loading ? (
          <div className="skills-list skills-loading">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skill-row" style={{ animation: "none", opacity: 1, transform: "none" }}>
                <div className="skill-icon" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "transparent" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
                </div>
                <div className="skill-info">
                  <div className="skill-header">
                    <span className="skill-name" style={{ color: "transparent", background: "rgba(255,255,255,0.06)", borderRadius: 4, width: 100, display: "inline-block" }}>&nbsp;</span>
                    <span className="skill-percent" style={{ color: "transparent", background: "rgba(255,255,255,0.06)", borderRadius: 4, width: 30, display: "inline-block" }}>&nbsp;</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{ width: "0%", background: "rgba(255,255,255,0.06)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="skills-list">
            {skills.map((skill: Skill, index: number) => {
              const Icon = getIcon(skill.title);
              return (
                <div
                  key={skill.title}
                  className="skill-row"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="skill-icon" style={{ color: skill.color }}>
                    <Icon size={20} />
                  </div>
                  <div className="skill-info">
                    <div className="skill-header">
                      <span className="skill-name">{skill.title}</span>
                      <span className="skill-percent">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-fill"
                        style={{
                          width: visible ? `${skill.level}%` : "0%",
                          transitionDelay: `${index * 100}ms`,
                          background: skill.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
