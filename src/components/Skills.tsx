import { useEffect, useRef, useState } from "react";
import { useSkills } from "@/hooks/use-public-api";

const DURATION = 1100;

/** Relogio unico: 0 -> 1 depois que a secao entra na tela. */
function useProgress(active: boolean, reduced: boolean) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setProgress(ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  return progress;
}

/**
 * Skills — linhas com nivel.
 * Cada linha entra escalonada, a barra cresce e o numero sobe junto.
 */
const Skills = () => {
  const { data: skills } = useSkills();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

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

  const progress = useProgress(visible, reduced);

  const groups = new Map<string, { title: string; level: number }[]>();
  (skills || []).forEach((skill) => {
    const key = skill.category || "Stack";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ title: skill.title, level: skill.level });
  });

  return (
    <section id="skills" className="band" ref={sectionRef}>
      <div className="page">
        <div className="band-head reveal">
          <h2>Stack</h2>
          <p>O que uso para construir APIs, modelar dados e colocar sistema em produção.</p>
        </div>

        <div className={`skill-rows ${visible ? "is-visible" : ""}`}>
          {[...groups.entries()].map(([label, items], groupIndex) => (
            <div
              className="skill-group"
              key={label}
              style={{ ["--group" as string]: groupIndex }}
            >
              <div className="skill-group-label">
                <span>{label}</span>
              </div>
              {items.map((item, index) => {
                const value = Math.round(item.level * progress);
                return (
                  <div
                    className="skill-row"
                    key={item.title}
                    style={{ ["--row" as string]: index }}
                  >
                    <span className="skill-name">{item.title}</span>
                    <span className="skill-value num">{value}</span>
                    <span
                      className="skill-bar"
                      style={{ transform: `scaleX(${(item.level / 100) * progress})` }}
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
