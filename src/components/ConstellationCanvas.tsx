import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; phase: number; speed: number; depth: number };

const EMBER = { r: 245, g: 73, b: 0 };
const SMOKE = { r: 191, g: 168, b: 245 };

/**
 * Constelacao carvao+creme: estrelas flutuantes com ligacoes finas,
 * parallax de rato (as camadas profundas se mexem devagar) e brilho suave.
 * Sem dependencias, requestAnimationFrame apenas. Pausa fora da tela.
 */
export default function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let running = false;
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
      const count = Math.min(110, Math.floor((width * height) / 15000));
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

      // ligações finas entre estrelas próximas
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const dist = Math.hypot(dx, dy);
          if (dist < 105) {
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
        const color = point.r > 1.2 ? EMBER : SMOKE;
        const glow = ctx.createRadialGradient(point.sx, point.sy, 0, point.sx, point.sy, point.r * 6);
        glow.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.85 * point.a})`);
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

      if (running) raf = requestAnimationFrame(tick);
    };

    let raf = 0;
    const onResize = () => {
      resize();
      if (reduced) {
        ctx.clearRect(0, 0, width, height);
        tickOnce();
      }
    };

    /** desenha um quadro so, sem se reagendar */
    const tickOnce = () => {
      const wasRunning = running;
      running = false;
      tick();
      running = wasRunning;
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    resize();

    // Nao gasta CPU fora da tela
    const visibility = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0 }
    );
    visibility.observe(canvas);

    if (reduced) {
      running = false;
      tickOnce();
    }

    return () => {
      stop();
      visibility.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-constellation" aria-hidden="true" />;
}
