import { useEffect, useRef, useState } from "react";
import { useAbout } from "@/hooks/use-public-api";

/**
 * About — "Side facts, wide paragraph".
 * Tres pares rotulo/valor na coluna esquerda; o paragrafo abre a secao
 * a partir de 34% da largura. Sem cabecalho, sem cartao.
 */
const OFFER = [
  "SaaS de ponta a ponta",
  "Bots de WhatsApp que vendem",
  "APIs com Pix e webhook assinado",
  "Automação com Playwright",
  "Sites rápidos e landing pages",
  "Recon e segurança ofensiva",
];

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
    { label: "Atua", value: "Full stack · sites, bots, APIs · SaaS com Pix" },
    { label: "Base", value: "Ribeirão Preto, SP — remoto em todo o Brasil" },
    { label: "Estuda", value: "Engenharia da Computação · Unaerp — turma manhã, 07:00–12:45" },
    { label: "Atende", value: "Seg a sex, 13:00–19:00 · e a noite quando precisa" },
    { label: "Ciber", value: "reconkit — recon p/ bug bounty (Python) · JWT/RBAC/HMAC" },
  ];

  return (
    <section id="about" className="band" ref={sectionRef}>
      <div className="page">
        <p className="band-kicker"><span className="num">01</span>Sobre</p>
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

          <ul className="about-offer" aria-label="O que eu faço">
            {OFFER.map((item, i) => (
              <li key={item}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
