import { useEffect, useState } from "react";

/** Linha de progresso no topo, gradiente ciano -> violeta. */
const ScrollLine = () => {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-line" aria-hidden="true">
      <span style={{ transform: `scaleX(${p})` }} />
    </div>
  );
};

export default ScrollLine;
