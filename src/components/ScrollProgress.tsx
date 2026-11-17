import { useEffect, useState } from "react";

const sections = [
  { id: "home", label: "INICIO" },
  { id: "about", label: "SOBRE" },
  { id: "skills", label: "SKILLS" },
  { id: "projects", label: "PROJETOS" },
  { id: "contact", label: "CONTATO" },
];

const ScrollProgress = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

      let current = 0;
      sections.forEach((section, index) => {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5) {
            current = index;
          }
        }
      });
      setActiveIndex(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="scroll-progress" aria-hidden>
      <div className="scroll-progress-line">
        <div className="scroll-progress-fill" style={{ height: `${scrollPercent}%` }} />
      </div>
      <div className="scroll-progress-dots">
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`scroll-progress-dot ${index === activeIndex ? "active" : ""}`}
            aria-label={section.label}
            tabIndex={-1}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollProgress;
