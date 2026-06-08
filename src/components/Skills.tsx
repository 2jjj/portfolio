import { useEffect, useRef, useState } from "react";
import { Box, Code, Database, GitBranch, HardDrive, Layers, Server, Zap } from "lucide-react";

const skills = [
  { icon: Zap, title: "Node.js", category: "Back-End", level: 94, color: "#00D4FF" },
  { icon: Server, title: "Express", category: "Back-End", level: 88, color: "#A5F3FF" },
  { icon: Database, title: "MongoDB", category: "Banco de Dados", level: 84, color: "#1E7F3A" },
  { icon: Layers, title: "Docker", category: "DevOps", level: 80, color: "#2496ED" },
  { icon: Code, title: "React", category: "Front-End", level: 90, color: "#00D4FF" },
  { icon: HardDrive, title: "PostgreSQL", category: "Banco de Dados", level: 76, color: "#3265A8" },
  { icon: GitBranch, title: "Git", category: "DevOps", level: 92, color: "#FF6B35" },
  { icon: Box, title: "Redis", category: "Banco de Dados", level: 70, color: "#DD1E1E" },
];

const Skills = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

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
        <p className="section-copy reveal" style={{ animationDelay: "0.1s" }}>
          As principais tecnologias que eu uso para construir back-end confiável, APIs performáticas e integrações estáveis.
        </p>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div
              key={skill.title}
              className="skill-card reveal"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="skill-top">
                <div className="skill-icon" style={{ background: `${skill.color}22`, color: skill.color }}>
                  <skill.icon size={22} />
                </div>
                <div>
                  <div className="skill-title">{skill.title}</div>
                  <div className="skill-meta">{skill.category}</div>
                </div>
              </div>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: visible ? `${skill.level}%` : "0%", transitionDelay: `${index * 100}ms` }} />
              </div>
              <div className="skill-meta">{skill.level}%</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
