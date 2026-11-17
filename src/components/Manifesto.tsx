import { useEffect, useRef } from "react";

/**
 * Manifesto: a frase grande antes do meu raio-x.
 * Aparece com clip-path wipe, como corte de filme.
 */
const Manifesto = () => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="manifesto" className="manifesto" ref={ref} aria-label="Manifesto">
      <div className="page">
        <p className="manifesto-kicker">( manifesto )</p>
        <h2 className="manifesto-heavy">
          Eu construo <em>do banco à tela</em>.
        </h2>
        <p className="manifesto-sub">
          Do pedido que cai na hora ao painel que a equipe usa todo dia —
          sistema de verdade, não vitrine bonita. Do primeiro commit ao go-live,
          da modelagem à cobrança Pix.
        </p>
      </div>
    </section>
  );
};

export default Manifesto;
