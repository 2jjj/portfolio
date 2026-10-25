import { useRef, useState, useEffect } from "react";
import {
  Boxes,
  Code,
  Coffee,
  Database,
  FileCode2,
  GitBranch,
  Layers,
  Server,
  Terminal,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useSkills } from "@/hooks/use-public-api";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, LucideIcon> = {
  Node: Zap,
  Express: Server,
  React: Code,
  Git: GitBranch,
  Docker: Layers,
  Go: Terminal,
  PostgreSQL: Database,
  TypeScript: FileCode2,
  Java: Coffee,
  Spring: Boxes,
  Python: FileCode2,
};

function getIcon(title: string): LucideIcon {
  for (const [key, icon] of Object.entries(iconMap)) {
    if (title.includes(key)) return icon;
  }
  return Code;
}

function SkillSkeleton() {
  return (
    <div className="skill-row" style={{ animation: "none", opacity: 1, transform: "none" }}>
      <div className="skill-icon" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "transparent" }}>
        <Skeleton className="h-5 w-5" />
      </div>
      <div className="skill-info">
        <div className="skill-header">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-2 w-full mt-2" />
      </div>
    </div>
  );
}

const Skills = () => {
  const { data: skills, isLoading } = useSkills();
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
        <h2 className="section-title marker-fill">
          Tecnologias que <span>domino</span>
        </h2>
        <p className="section-copy">
          Ferramentas que uso para construir APIs, modelar dados e colocar sistemas em produção.
        </p>

        {isLoading ? (
          <div className="skills-list">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkillSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="skills-list">
            {(skills || []).map((skill, index) => {
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
                    <div
                      className="skill-bar"
                      role="progressbar"
                      aria-label={`${skill.title}: ${skill.level}%`}
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
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
