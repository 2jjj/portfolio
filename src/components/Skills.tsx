import { useEffect, useRef, useState } from "react";
import { Code, Coffee, GitBranch, Layers, Server, Terminal, Zap, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";

const iconMap: Record<string, LucideIcon> = {
  Node: Zap,
  Express: Server,
  React: Code,
  Git: GitBranch,
  Docker: Layers,
  Go: Terminal,
  Spring: Coffee,
};

function getIcon(title: string): LucideIcon {
  for (const [key, icon] of Object.entries(iconMap)) {
    if (title.includes(key)) return icon;
  }
  return Code;
}

const Skills = () => {
  const [skills, setSkills] = useState<any[]>([]);
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
          Tecnologias <span>domínio</span>
        </h2>
        <p className="section-copy">
          Ferramentas e tecnologias que utilizo no dia a dia para construir soluções robustas.
        </p>

        {loading ? (
          <p className="section-copy">Carregando...</p>
        ) : (
          <div className="skills-list">
            {skills.map((skill: any, index: number) => {
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
