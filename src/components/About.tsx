import { useEffect, useRef, useState } from "react";
import { useAbout } from "@/hooks/use-public-api";
import ConstellationCanvas from "@/components/ConstellationCanvas";

/**
 * About — "Side facts, wide paragraph".
 * Tres pares rotulo/valor na coluna esquerda; o paragrafo abre a secao
 * a partir de 34% da largura. Sem cabecalho, sem cartao.
 */
const About = () => {
  const { data: aboutData } = useAbout();
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

  const facts = [
    { label: "Estuda", value: "Engenharia da Computação · Unaerp" },
    { label: "Turma", value: "Manhã, 07:00–12:45" },
    { label: "Atende", value: "13:00–19:00 · e a noite quando precisa" },
  ];

  return (
    <section id="about" className="band" ref={sectionRef}>
      <div className="constellation-layer" aria-hidden="true">
        <ConstellationCanvas />
      </div>
      <div className="page">
        <div className={`reveal ${visible ? "visible" : ""}`}>
          <div className="about">
            <dl className="about-facts">
              {facts.map((fact) => (
                <div className="about-fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="about-copy">{aboutData.about_text}</p>
              {aboutData.about_secondary && (
                <p className="about-copy">{aboutData.about_secondary}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
