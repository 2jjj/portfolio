import { useEffect, useRef, useState } from "react";
import { useSkills } from "@/hooks/use-public-api";

/**
 * Skills — "Two-ended rows, narrow column".
 * Nome a esquerda, valor a direita, nada desenhado entre as linhas.
 */
const Skills = () => {
  const { data: skills } = useSkills();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const groups = new Map<string, { title: string; level: number }[]>();
  (skills || []).forEach((skill) => {
    const key = skill.category || "Stack";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ title: skill.title, level: skill.level });
  });

  return (
    <section id="skills" className="band" ref={sectionRef}>
      <div className="page">
        <div className="band-head reveal visible">
          <h2>Stack</h2>
          <p>O que uso para construir APIs, modelar dados e colocar sistema em produção.</p>
        </div>

        <div className={`reveal ${visible ? "visible" : ""}`}>
          <div className="skill-rows">
            {[...groups.entries()].map(([label, items]) => (
              <div className="skill-group" key={label}>
                <div className="skill-group-label">{label}</div>
                {items.map((item) => (
                  <div className="skill-row" key={item.title}>
                    <span className="skill-name">{item.title}</span>
                    <span className="skill-value num">{item.level}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
