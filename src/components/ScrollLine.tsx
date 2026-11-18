import { useEffect, useRef } from "react";

/** Linha de progresso no topo. rAF + transform direto, zero re-render. */
const ScrollLine = () => {
  const barRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const paint = () => {
      raf = 0;
      const bar = barRef.current;
      if (!bar) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-line" aria-hidden="true">
      <span ref={barRef} />
    </div>
  );
};

export default ScrollLine;
