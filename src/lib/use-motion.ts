import { useEffect, type RefObject } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Botao magnetico: segue o cursor dentro de um raio e volta
 * com mola quando ele sai. Nada de lib, so transform.
 */
export function useMagnetic(ref: RefObject<HTMLElement>, strength = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const render = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(relX, relY);
      const radius = Math.max(rect.width, rect.height) * 0.9;

      if (dist < radius) {
        tx = relX * strength;
        ty = relY * strength;
      } else {
        tx = 0;
        ty = 0;
      }
      kick();
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [ref, strength]);
}

/**
 * Inclinacao 3D no ponteiro: o cartao vira de leve na direcao do mouse
 * e volta ao plano quando ele sai.
 */
export function useTilt(ref: RefObject<HTMLElement>, max = 6) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;

    el.style.transformStyle = "preserve-3d";
    el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${(px * max).toFixed(
        2
      )}deg) rotateX(${(-py * max).toFixed(2)}deg) scale(1.012)`;
    };

    const onLeave = () => {
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, [ref, max]);
}
