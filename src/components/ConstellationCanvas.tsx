import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; phase: number; speed: number; depth: number };

const EMBER = { r: 255, g: 107, b: 53 };
const GOLD = { r: 255, g: 208, b: 132 };

/**
 * ConstelaÃ§Ã£o ember: estrelas flutuantes com ligaÃ§Ãµes finas,
 * parallax de rato (as camadas profundas se mexem devagar) e brilho suave.
 * Sem dependÃªncias, requestAnimationFrame apenas.
 */
export default function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let frame = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0.5, y: 0.5, active: false };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(64, Math.floor((width * height) / 22000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.35,
        depth: 0.25 + Math.random() * 0.75,
      }));
    };

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / (rect.width || 1);
      mouse.y = (event.clientY - rect.top) / (rect.height || 1);
      mouse.active = true;
    };

    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      const parallax = 0.018;
      const ox = mouse.active ? (mouse.x - 0.5) * width * parallax : 0;
      const oy = mouse.active ? (mouse.y - 0.5) * height * parallax : 0;

      const points = stars.map((star) => ({
        ...star,
        sx: star.x + ox * star.depth,
        sy: star.y + oy * star.depth,
        a: 0.55 + 0.45 * Math.sin(frame * 0.02 * star.speed + star.phase),
      }));

      // ligaÃ§Ãµes finas entre estrelas prÃ³ximas
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const alpha = (1 - dist / 105) * 0.22;
            ctx.strokeStyle = `rgba(${EMBER.r}, ${EMBER.g}, ${EMBER.b}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      for (const point of points) {
        const color = point.r > 1.2 ? EMBER : GOLD;
        const glow = ctx.createRadialGradient(point.sx, point.sy, 0, point.sx, point.sy, point.r * 6);
        glow.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.55 * point.a})`);
        glow.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(point.sx, point.sy, point.r * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.75 * point.a})`;
        ctx.beginPath();
        ctx.arc(point.sx, point.sy, point.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    let raf = requestAnimationFrame(tick);
    const onResize = () => resize();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-constellation" aria-hidden="true" />;
}
